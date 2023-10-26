# Copyright 2021 The KServe Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import argparse
import base64
import io
from typing import Dict, Union
import urllib.request
import cv2
import numpy as np
import base64

from PIL import Image
from torchvision import transforms
from kserve import Model, ModelServer, model_server, InferInput, InferRequest, InferResponse
from kserve.model import PredictorProtocol
import torchvision
import torch
import json


class ImageTransformer(Model):
    def __init__(self, name: str, predictor_host: str, protocol: str, use_ssl: bool):
        super().__init__(name)
        self.predictor_host = predictor_host
        self.protocol = protocol
        self.use_ssl = use_ssl
        self.ready = True

        image_size = 128
        self.transform_pipeline = torchvision.transforms.Compose([
            torchvision.transforms.Resize([image_size, image_size]),
            torchvision.transforms.ToTensor(),
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


    def preprocess(self, payload: Dict, headers: Union[None, Dict[str, str]] = None) -> Dict:
        if headers is not None:
            headers["request-type"] = "v1"
        # Input follows the Tensorflow V1 HTTP API for binary values
        # https://www.tensorflow.org/tfx/serving/api_rest#encoding_binary_values
        video_raw = payload['instances'][0]['data']
        video_raw = base64.b64decode(video_raw)

        with open('here.webm', 'wb') as file:
            file.write(video_raw)

        video = cv2.VideoCapture('here.webm')

        images = []

        ret, frame = video.read()

        xy_max = np.array([frame.shape[1], frame.shape[0]])
        xy_min = np.array([0, 0])
        xy_center = (xy_max + xy_min) / 2 - 20
        xy_radius = (xy_max - xy_center).max(axis=0)

        while ret:
            image = self._crop(frame, xy_center, xy_radius)
            image = cv2.resize(image, (256, 256))
            image = Image.fromarray(image)
            image.crop((16, 16, 240, 240))

            images.append(self.transform_pipeline(image))

            ret, frame = video.read()

        section = torch.stack(images, dim=0)
        section = section.permute(1, 0, 2, 3)
        # section = section.reshape((1, *section.size())).numpy()
        section = section.numpy()
        print(section.shape)
        inputs = [{'data': section.tolist() }]


        # Download the video


        # input_tensors = numpy.asarray(input_tensors)
        # infer_inputs = [InferInput(name="INPUT__0", datatype='FP32', shape=list(input_tensors.shape),
        #                            data=input_tensors)]
        # infer_request = InferRequest(model_name=self.name, infer_inputs=infer_inputs)


        payload = {"instances": inputs}
        return payload


parser = argparse.ArgumentParser(parents=[model_server.parser])
parser.add_argument(
    "--predictor_host", help="The URL for the model predict function", required=True
)
parser.add_argument(
    "--protocol", help="The protocol for the predictor", default="v1"
)
parser.add_argument(
    "--model_name", help="The name that the model is served under."
)
parser.add_argument(
    "--use_ssl", help="Use ssl for connecting to the predictor", action='store_true'
)
args, _ = parser.parse_known_args()

if __name__ == "__main__":
    model = ImageTransformer(args.model_name, predictor_host=args.predictor_host,
                             protocol=args.protocol, use_ssl=args.use_ssl)
    ModelServer().start([model])
