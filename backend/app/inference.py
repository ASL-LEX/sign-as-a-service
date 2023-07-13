import cv2
import torch
import numpy as np
from model import Model


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

    for _ in range(
        min(int(end_frame - start_frame), int(total_frames - start_frame))
    ):
        success, img = vidcap.read()
        if not success:
            break
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        frames.append(img)

    return np.asarray(frames)


def transform(video_path: str):
    frames = load_frames_from_video(video_path)
    transform = Compose([
        NumpyToTensor(),
        RandomTemporalSubsample(num_frames=16),
        torchvision.transforms.Resize(size=(224, 224)),
        TCHW2CTHW()
        ])

    return transform(frames)
