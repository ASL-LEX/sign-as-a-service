import torch
from svt.models.timesformer import VisionTransformer, partial


class SignModel(torch.nn.Module):
    def __init__(self, num_classes=255, img_size=224, patch_size=16, embed_dim=768):
        # Setup the vision transformer
        self.vit = VisionTransformer(
            img_size=img_size,
            num_classes=num_classes,
            patch_size=patch_size,
            embed_dim=embed_dim,
            depth=12,
            num_heads=12,
            mlp_ratio=4,
            qkv_bias=True,
            norm_layer=partial(torch.nn.LayerNorm, eps=1e-6),
            attn_drop_rate=0.,
            drop_path_rate=0.1,
            num_frames=8,
            attention_type='divided_space_time'
        )
        self.vit.attention_type = 'divided_space_time'
        self.vit.num_patches = (img_size // patch_size) * (img_size // patch_size)
        self.vit.head = None

        # Setup linear classifier layer
        # TODO: Pull out hardcoded config values. These are from reading
        # the SVT sample code
        dim = embed_dim * (4 + int(False))
        self.linear = torch.nn.Linear(dim, num_classes)


    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Pass through vision transformer
        x = self.vit(x)
        # Flattern for linear layer
        x = x.view(x.size(0), -1)
        # Pass through linear classifier
        x = self.linear(x)
        return x
