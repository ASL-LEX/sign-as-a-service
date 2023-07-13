import torch
from model import Model

# Code to load weights
model = Model(num_class=60)
checkpoint = torch.load("sign_recognizer.ckpt")
model.load_state_dict(checkpoint["state_dict"])
