import os
import torch
from model import Model
import uvicorn
import strawberry
from strawberry.asgi import GraphQL
from strawberry.file_uploads import Upload
from strawberry.types import Info
from inference import transform


class Context:
    def __init__(self, model):
        self.model = model


@strawberry.type
class Query:
    @strawberry.field
    def classify(self, info: Info, video_file: Upload) -> str:
        video_path = os.path.join("path_to_upload", video_file.filename)
        frames_tensor = transform(video_path)
        return info.context.model.classify(frames_tensor)


def create_app():
    model = Model(num_class=60)
    checkpoint = torch.load("sign_recognizer.ckpt")
    model.load_state_dict(checkpoint["state_dict"])

    def context_factory():
        return Context(model)

    schema = strawberry.Schema(query=Query)
    return GraphQL(schema, context_factory=context_factory)


if __name__ == "__main__":
    app = create_app()
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
