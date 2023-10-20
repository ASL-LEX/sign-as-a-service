from pathlib import Path
import torchvision
import torch
import cv2
import numpy as np


class Transform:
    def __init__(self, image_size: int) -> None:
        self.transform_pipeline = torchvision.transforms.Compose([
            torchvision.transforms.Resize([image_size, image_size]),
            torchvision.transforms.Normalize(mean=[0.5], std=[0.5])
        ])

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

    def apply(self, video_path: Path, output_path: Path) -> None:
        # Open the video for slicing
        video = cv2.VideoCapture(video_path.as_posix())

        ret, frame = video.read()

        # Relic of original cropping logic, in the future the cropping logic
        # can be modified
        xy_max = np.array([frame.shape[0], frame.shape[1]])
        xy_min = np.array([0, 0])
        xy_center = (xy_max + xy_min) / 2 - 20
        xy_radius = (xy_max - xy_center).max(axis=0)

        images = []
        while ret:
            # Crop the image and resize
            image = self._crop(frame, xy_center, xy_radius)

            # Apply transformation pipline
            images.append(self.transform_pipeline(torch.from_numpy(image.astype('float64'))))

            # Grab the next frame
            ret, frame = video.read()
            print(ret)

        # Stack the images for the 3D CNN
        images = torch.stack(images, dim=0)
        images = images.reshape((1, *images.size()))

        # Store the results in the output
        with open(output_path, 'wb') as output:
            torch.save(images, output)


