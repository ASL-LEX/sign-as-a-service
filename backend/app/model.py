import math
import torch
import torch.nn as nn
import pytorchvideo.models.hub as ptv_hub


AVAILABLE_3D_BACKBONES = [
    "i3d_r50",
    "c2d_r50",
    "csn_r101",
    "r2plus1d_r50",
    "slow_r50",
    "slowfast_r50",
    "slowfast_r101",
    "slowfast_16x8_r101_50_50",
    "x3d_xs",
    "x3d_s",
    "x3d_m",
    "x3d_l",
]


class CNN3D(nn.Module):
    """
    Initializes the 3D Convolution backbone.

    **Supported Backbones**

    - `i3d_r50`
    - `c2d_r50`
    - `csn_r101`
    - `r2plus1d_r5`
    - `slow_r50`
    - `slowfast_r50`
    - `slowfast_r101`
    - `slowfast_16x8_r101_50_50`
    - `x3d_xs`
    - `x3d_s`
    - `x3d_m`
    - `x3d_l`

    Args:
        in_channels (int): Number of input channels
        backbone (string): Backbone to use
        pretrained (bool, optional): Whether to use pretrained Backbone.
                                     Default: ``True``
        **kwargs (optional): Will be passed to pytorchvideo.models.hub models;

    """

    def __init__(self, in_channels, backbone, pretrained=True, **kwargs):
        super().__init__()
        self.backbone = self.get_3d_backbone(
            backbone, in_channels, pretrained, **kwargs
        )
        self.n_out_features = 400

    def forward(self, x):
        """
        forward step
        """
        x = self.backbone(x.type(torch.cuda.FloatTensor))
        return x.transpose(0, 1)  # Batch-first

    def get_3d_backbone(
        self,
        name,
        in_channels=3,
        pretrained: bool = False,
        progress: bool = True,
        **kwargs
    ):
        assert name in AVAILABLE_3D_BACKBONES, "Supported bonebones " + str(
            AVAILABLE_3D_BACKBONES
        )

        model = getattr(ptv_hub, name)(
            pretrained=pretrained, progress=progress, **kwargs
        )
        if in_channels != 3:
            reshape_conv_input_size(in_channels, model)

        return model


def reshape_conv_input_size(in_channels, model):
    """
    Change convolution layer to adopt to various input channels
    """
    assert in_channels == 1 or in_channels >= 4
    for module in model.modules():
        if isinstance(module, nn.Conv3d):
            break

    module.in_channels = in_channels
    weight = module.weight.detach()

    if in_channels == 1:
        module.weight = nn.parameter.Parameter(weight.sum(1, keepdim=True))
    else:
        curr_in_channels = module.weight.shape[1]
        to_concat = torch.Tensor(
            module.out_channels,
            module.in_channels - curr_in_channels,
            *module.kernel_size,
        )
        module.weight = nn.parameter.Parameter(
            torch.cat([module.weight, to_concat], axis=1)
        )


class FC(nn.Module):
    """
    Fully connected layer head
    Args:
        n_features (int): Number of features in the input.
        num_class (int): Number of class for classification.
        dropout_ratio (float): Dropout ratio to use Default: 0.2.
        batch_norm (bool): Whether to use batch norm or not. Default: `False`.
    """

    def __init__(self, n_features, num_class, dropout_ratio=0.2, batch_norm=False):
        super().__init__()
        self.dropout = nn.Dropout(p=dropout_ratio)
        self.bn = batch_norm
        if batch_norm:
            self.bn = nn.BatchNorm1d(self.n_features)
            self.bn.weight.data.fill_(1)
            self.bn.bias.data.zero_()
        self.classifier = nn.Linear(n_features, num_class)
        nn.init.normal_(self.classifier.weight, 0, math.sqrt(2.0 / num_class))

    def forward(self, x):
        """
        Args:
            x (torch.Tensor): Input tensor of shape: (batch_size, n_features)

        returns:
            torch.Tensor: logits for classification.
        """

        x = self.dropout(x)
        if self.bn:
            x = self.bn(x)
        x = self.classifier(x)
        return x


class NParamFC(nn.Module):
    def __init__(
        self, n_features, num_class, params, dropout_ratio=0.2, batch_norm=False
    ):
        super().__init__()
        self.dropout = nn.Dropout(p=dropout_ratio)
        self.bn = batch_norm
        if batch_norm:
            self.bn = nn.BatchNorm1d(self.n_features)
            self.bn.weight.data.fill_(1)
            self.bn.bias.data.zero_()

        self.classifier = nn.Linear(n_features, num_class)
        nn.init.normal_(self.classifier.weight, 0, math.sqrt(2.0 / num_class))

        self.param_clfs = {}
        for param, n in params.items():
            self.param_clfs[param] = nn.Linear(n_features, n)
            nn.init.normal_(self.param_clfs[param].weight, 0, math.sqrt(2.0 / n))
        self.param_clfs = nn.ModuleDict(self.param_clfs)

    def forward(self, x):
        """
        Args:
            x (torch.Tensor): Input tensor of shape: (batch_size, n_features)

        returns:
            torch.Tensor: logits for the gloss classification.
            dict { param : torch.Tensor } phoneme type logits
        """

        x = self.dropout(x)
        if self.bn:
            x = self.bn(x)

        x_sign = self.classifier(x)
        x_params = {param: clf(x) for param, clf in self.param_clfs.items()}

        return x_sign, x_params


class Encoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.cnn3d = CNN3D(in_channels=3, backbone="i3d_r50")

    def forward(self, x):
        return self.cnn3d(x)


class Decoder(nn.Module):
    def __init__(self, num_class):
        super().__init__()
        self.fc = FC(n_features=400, num_class=num_class)

    def forward(self, x):
        return self.fc(x)


class Model(nn.Module):
    def __init__(self, num_class):
        super().__init__()
        self.encoder = Encoder()
        self.decoder = Decoder(num_class)

    def forward(self, x):
        x = self.encoder(x)
        x = self.decoder(x)
        return x
