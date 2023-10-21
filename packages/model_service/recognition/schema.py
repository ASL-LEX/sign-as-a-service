import strawberry
import typing
import cv2
import numpy as np

from recognition.predict import predict

def crop(image: np.ndarray, center: np.ndarray, radius: np.ndarray) -> np.ndarray:
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
class LexiconEntry:
    key: str
    lexicon: str


@strawberry.federation.type
class RecognitionResult:
    entry: LexiconEntry
    confidence: float


@strawberry.type
class Query:
    @strawberry.field
    async def predict(self, lexicon: str, file: str) -> typing.List[RecognitionResult]:
        results = []
        for label in predict():
            results.append(RecognitionResult(entry=LexiconEntry(key=label, lexicon=lexicon), confidence=0.9))
        return results


# Create the schema
schema = strawberry.federation.Schema(query=Query, enable_federation_2=True)
