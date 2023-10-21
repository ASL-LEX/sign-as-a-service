from pathlib import Path
from PIL import Image
import torchvision
import torch
import cv2
import numpy as np
from typing import List


class Transform:
    def __init__(self, image_size: int, sample_duration=32, test_clips=5) -> None:
        self.transform_pipeline = torchvision.transforms.Compose([
            torchvision.transforms.Resize([image_size, image_size]),
            torchvision.transforms.ToTensor(),
            torchvision.transforms.Normalize(mean=[0.5], std=[0.5])
        ])

        self.sample_duration = sample_duration
        self.test_clips = test_clips

    def frame_indices_tranform_test(self, video_length: int, clip_no: int):
        """
        TODO: Assess necessity of the following method

        Taken from
        https://github.com/jackyjsy/CVPR21Chal-SLR/blob/main/Conv3D/dataset_sign_clip.py#L46
        """
        if video_length > self.sample_duration:
            start = (video_length - self.sample_duration) // (self.test_clips - 1) * clip_no
            frame_indices = np.arange(start, start + self.sample_duration) + 1
        elif video_length == self.sample_duration:
            frame_indices = np.arange(self.sample_duration) + 1
        else:
            frame_indices = np.arange(video_length)
            while frame_indices.shape[0] < self.sample_duration:
                frame_indices = np.concatenate((frame_indices, np.arange(video_length)), axis=0)
            frame_indices = frame_indices[:self.sample_duration] + 1

        return frame_indices

    def _crop(self, image: np.ndarray, center: np.ndarray, radius: np.ndarray) -> np.ndarray:
        scale = 1.3
        radius_crop = (radius * scale).astype(np.int32)
        center_crop = (center).astype(np.int32)

        rect = (max(0,(center_crop-radius_crop)[0]), max(0,(center_crop-radius_crop)[1]),
                     min(512,(center_crop+radius_crop)[0]), min(512,(center_crop+radius_crop)[1]))

        image = image[rect[1]:rect[3],rect[0]:rect[2],:]

        if image.shape[0] < image.shape[1]:
            top = abs(image.shape[0] - image.shape[1]) // 2
            bottom = abs(image.shape[0] - image.shape[1]) - top
            image = cv2.copyMakeBorder(image, top, bottom, 0, 0, cv2.BORDER_CONSTANT,value=(0,0,0))
        elif image.shape[0] > image.shape[1]:
            left = abs(image.shape[0] - image.shape[1]) // 2
            right = abs(image.shape[0] - image.shape[1]) - left
            image = cv2.copyMakeBorder(image, 0, 0, left, right, cv2.BORDER_CONSTANT,value=(0,0,0))
        return image

    def save_section(self, images: List[torch.Tensor], clip_no: int) -> None:
        # Get the index of the images for this section
        index_list = self.frame_indices_tranform_test(len(images), clip_no)

        # Grab the images
        section = []
        for i in index_list:
            section.append(images[i - 1])

        # Convert the images fro a 3D CNN
        section = torch.stack(section, dim=0)
        section = section.permute(1, 0, 2, 3)
        section = section.reshape((1, *section.size()))
        torch.save(section, './sections/section_{}.pt'.format(clip_no))

    def apply(self, video_path: Path) -> None:
        # Open the video for slicing
        video = cv2.VideoCapture(video_path.as_posix())

        ret, frame = video.read()

        # Relic of original cropping logic, in the future the cropping logic
        # can be modified
        xy_max = np.array([frame.shape[1], frame.shape[0]])
        xy_min = np.array([0, 0])
        xy_center = (xy_max + xy_min) / 2 - 20
        xy_radius = (xy_max - xy_center).max(axis=0)

        # Read in all images
        images = []
        while ret:
            # Crop the image and resize
            image = self._crop(frame, xy_center, xy_radius)
            image = cv2.resize(image, (256, 256))

            image = Image.fromarray(image)
            image.crop((16, 16, 240, 240))

            # Apply transformation pipline
            images.append(self.transform_pipeline(image))

            # Grab the next frame
            ret, frame = video.read()

        # Produce the test set
        for i in range(0, self.test_clips):
            self.save_section(images, i)
