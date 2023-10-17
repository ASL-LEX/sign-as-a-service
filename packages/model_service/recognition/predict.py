import typing
import torchvision
import torch
import numpy as np
import os
from PIL import Image
from recognition.model import r2plus1d_18
from collections import OrderedDict
import json

with open('labels.json', 'r') as labels_file:
    labels = json.load(labels_file)


image_size = 128
folder_path = '/home/cbolles/devel/temp/saas/CVPR21Chal-SLR/data/test_frames/girl_respo/'
checkpoint_file = '/home/cbolles/devel/temp/saas/final_models_finetuned/rgb_final_finetuned.pth'
num_frames = 32
test_clips = 5

# PyTorch setup
os.environ['CUDA_VISIBLE_DEVICES']='0,1,2,3'
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load model
model = r2plus1d_18(pretrained=True, num_classes=226)

# Restore model from checkpoint
checkpoint = torch.load(checkpoint_file)
new_state_dict = OrderedDict()
for k, v in checkpoint.items():
    name = k[7:]
    new_state_dict[name] = v
model.load_state_dict(new_state_dict)
model = model.to(device)
# Run the model parallelly
if torch.cuda.device_count() > 1:
    print('Using {} GPUs'.format(torch.cuda.device_count()))
    model = torch.nn.DataParallel(model)

# Make data transformer
transform = torchvision.transforms.Compose([
    torchvision.transforms.Resize([image_size, image_size]),
    torchvision.transforms.ToTensor(),
    torchvision.transforms.Normalize(mean=[0.5], std=[0.5])
])


def frame_indices_tranform_test(video_length, sample_duration, clip_no=0):
    """
    TODO: Assess necessity of the following method

    Taken from
    https://github.com/jackyjsy/CVPR21Chal-SLR/blob/main/Conv3D/dataset_sign_clip.py#L46
    """
    if video_length > sample_duration:
        start = (video_length - sample_duration) // (test_clips - 1) * clip_no
        frame_indices = np.arange(start, start + sample_duration) + 1
    elif video_length == sample_duration:
        frame_indices = np.arange(sample_duration) + 1
    else:
        frame_indices = np.arange(video_length)
        while frame_indices.shape[0] < sample_duration:
            frame_indices = np.concatenate((frame_indices, np.arange(video_length)), axis=0)
        frame_indices = frame_indices[:sample_duration] + 1

    return frame_indices


def read_images(folder: str, transform: torchvision.transforms.Compose, clip_no: int) -> torch.Tensor:
    images = []
    index_list = frame_indices_tranform_test(len(os.listdir(folder)), 32, clip_no)
    for i in index_list:
        image = Image.open(os.path.join(folder_path, '{:04d}.jpg').format(i))
        image = image.crop((16, 16, 240, 240))
        images.append(transform(image))

    # Convert the images fro a 3D CNN
    images = torch.stack(images, dim=0)
    images = images.permute(1, 0, 2, 3)
    return images


def predict(folder) -> typing.List[int]:
    # Read in images

    # TODO: Understand why this is called multiple times
    images = []
    for i in range(0, test_clips):
        images.append(read_images(folder, transform, i))
    images = torch.stack(images, dim=0)
    images = images.reshape((1, *images.size()))

    model.eval()
    with torch.no_grad():
        images = images.to(device)

        outputs_clips = []
        for i_clip in range(images.size(1)):
            inputs = images[:,i_clip,:,:]
            outputs_clips.append(model(inputs))
        outputs = torch.mean(torch.stack(outputs_clips, dim=0), dim=0)
        predictions = torch.topk(outputs, 5)[1]

    pred_labels = []
    for prediction in predictions.tolist()[0]:
        pred_labels.append(labels[str(prediction)])
    return pred_labels
