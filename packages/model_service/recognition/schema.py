import strawberry
from strawberry.file_uploads import Upload
import typing
import cv2
import tempfile
import numpy as np

from recognition.predict import predict


def crop(image, center, radius, size=512):
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


@strawberry.type
class RecognitionResult:
    label: str


@strawberry.type
class Query:
    @strawberry.field
    async def predict(self, lexicon: str, file: Upload) -> typing.List[RecognitionResult]:
        # Save the video stream
        file_content = await file.read()
        with open('here.webm', 'wb') as video_file:
            video_file.write(file_content)
        video = cv2.VideoCapture(video_file.name)

        # Create the video slices
        ret, frame = video.read()
        xy_max = np.array([640, 480])
        xy_min = np.array([0, 0])
        xy_center = (xy_max + xy_min) / 2 - 20
        xy_radius = (xy_max - xy_center).max(axis=0)
        index = 0

        while ret:
            image = crop(frame, xy_center, xy_radius)
            image = cv2.resize(image, (256, 256))
            print(image)
            index += 1
            location = './images/frame_{}.jpg'.format(index)
            print(location)
            cv2.imwrite(location, image)
            ret, frame = video.read()

        print(predict('./images/'))

        return [ RecognitionResult(label='cat'), RecognitionResult(label='dog')]


# Create the schema
schema = strawberry.Schema(query=Query)
