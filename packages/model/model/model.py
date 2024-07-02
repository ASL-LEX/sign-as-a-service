import torch
from svt.models.timesformer import VisionTransformer


class SignModel(torch.nn.Module):
    def __init__(self):
        backbone = VisionTransformer()
        pass


    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return x
