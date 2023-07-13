import os
import torch
from .model import Model
import uvicorn
import strawberry
from strawberry.asgi import GraphQL
from strawberry.file_uploads import Upload
from strawberry.types import Info
from .inference import transform
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware


class ModelMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        request.state.model = request.app.state.model
        response = await call_next(request)
        return response


class Context:
    def __init__(self, request):
        self.model = request.state.model


@strawberry.type
class Query:
    @strawberry.field
    def classify(self, info: Info, video_file: Upload) -> str:
        video_path = os.path.join("path_to_upload", video_file.filename)
        frames_tensor = transform(video_path)
        return info.context.model.classify(frames_tensor)


@strawberry.type
class Mutation:
    @strawberry.mutation
    def upload_file(self, file: Upload) -> bool:
        # Here you would typically handle the file, for example by saving it to disk
        # and possibly return some result of that operation, like a confirmation or the saved file's path
        return True


def create_app():
    model = Model(num_class=60)
    # checkpoint = torch.load("sign_recognizer.ckpt")
    # model.load_state_dict(checkpoint["state_dict"])

    def get_context(request):
        return Context(request)

    schema = strawberry.Schema(query=Query, mutation=Mutation)
    middleware = [Middleware(ModelMiddleware)]
    graphql_app = GraphQL(schema, context_getter=get_context)
    app = Starlette(middleware=middleware)
    app.mount("/", graphql_app)
    app.state.model = model
    return app


app = create_app()
