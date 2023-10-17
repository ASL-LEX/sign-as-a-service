import torch
import torchvision

def convert_relu_to_swish(model):
    for child_name, child in model.named_children():
        if isinstance(child, torch.nn.ReLU):
            setattr(model, child_name, torch.nn.SiLU(True))
        else:
            convert_relu_to_swish(child)


class r2plus1d_18(torch.nn.Module):
    """
    Model for handling single sign detection. This is taken from the following
    location

    https://github.com/jackyjsy/CVPR21Chal-SLR/blob/main/Conv3D/models/Conv3D.py
    """
    def __init__(self, pretrained=True, num_classes=500, dropout_p=0.5):
        super(r2plus1d_18, self).__init__()

        self.pretrained = pretrained
        self.num_classes = num_classes

        model = torchvision.models.video.r2plus1d_18(pretrained=self.pretrained)

        # Delete the last layer
        modules = list(model.children())[:-1]

        self.r2plus1d_18 = torch.nn.Sequential(*modules)

        convert_relu_to_swish(self.r2plus1d_18)
        self.fc1 = torch.nn.Linear(model.fc.in_features, self.num_classes)
        self.dropout = torch.nn.Dropout(dropout_p, inplace=True)

    def forward(self, x):
        out = self.r2plus1d_18(x)
        out = out.flatten(1)
        out = self.dropout(out)
        return self.fc1(out)
