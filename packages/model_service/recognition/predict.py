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
checkpoint_file = '/home/cbolles/devel/temp/saas/final_models_finetuned/rgb_final_finetuned.pth'
num_frames = 32
test_clips = 5

# PyTorch setup
os.environ['CUDA_VISIBLE_DEVICES']='0'
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
        image = Image.open(os.path.join(folder, 'frame_{}.jpg').format(i))
        image = image.crop((16, 16, 240, 240))
        images.append(transform(image))

    # Convert the images fro a 3D CNN
    images = torch.stack(images, dim=0)
    images = images.permute(1, 0, 2, 3)
    return images


def predict(folder: str, lexicon: str) -> typing.List[int]:
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

# torch.Size([512, 32, 128, 128])
# torch.Size([1, 5, 3, 32, 128, 128])

def predict_a(folder: str, lexicon: str) -> typing.List[str]:
    model_predictions = []

    """
    images = []
    for section_path in os.listdir('./sections'):
        images.append(torch.load(os.path.join('./sections', section_path)))
    images = torch.stack(images, dim=0)
    images = images.reshape((1, *images.size()))
    print(images.shape)
    images = images.to(device)
    """

    model.eval()
    with torch.no_grad():
        for section_path in os.listdir('./sections'):
        # for i_clip in range(images.size(1)):
            # Load section from file system
            section = torch.load(os.path.join('./sections', section_path)).to(device)

            # Generate prediction across section
            model_predictions.append(model(section))
            # model_predictions.append(model(images[:,i_clip,:,:]))
            # print(model_predictions)

            # Free memory
            del section
            torch.cuda.empty_cache()

    average_predictions = torch.mean(torch.stack(model_predictions, dim=0), dim=0)
    top_predictions = torch.topk(average_predictions, 5)[1]

    prediction_labels = []
    for prediction in top_predictions.tolist()[0]:
        prediction_labels.append(labels[str(prediction)])

    return prediction_labels

