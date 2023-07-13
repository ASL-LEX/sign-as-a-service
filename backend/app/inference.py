import cv2
import torch
import torchvision
import numpy as np
from .transformations import NumpyToTensor, RandomTemporalSubsample, TCHW2CTHW


def load_frames_from_video(video_path, start_frame=None, end_frame=None):
    """
    Load the frames of the video
    Returns: numpy array of shape (T, H, W, C)
    """
    frames = []
    vidcap = cv2.VideoCapture(video_path)
    total_frames = vidcap.get(cv2.CAP_PROP_FRAME_COUNT)

    if start_frame is None:
        start_frame = 0
    if end_frame is None:
        end_frame = total_frames

    # TODO: Update temporary fix
    if total_frames < start_frame:
        start_frame = 0
    vidcap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    window = min(int(end_frame - start_frame), int(total_frames - start_frame))

    for _ in range(window):
        success, img = vidcap.read()
        if not success:
            break
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        frames.append(img)

    return np.asarray(frames)


def transform(video_path: str):
    frames = load_frames_from_video(video_path)
    transform = torchvision.transforms.Compose(
        [
            NumpyToTensor(),
            RandomTemporalSubsample(num_samples=16),
            torchvision.transforms.Resize(size=(224, 224)),
            TCHW2CTHW(),
        ]
    )

    return transform(frames)
