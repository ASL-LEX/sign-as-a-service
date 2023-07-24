import uvicorn
import omegaconf
import strawberry
from strawberry.asgi import GraphQL
from openhands.apis.inference import InferenceModel


@strawberry.type
class Query:
    @strawberry.field
    def classify(self, info) -> dict:
        cfg = omegaconf.OmegaConf.load("./config.yaml")
        model = InferenceModel(cfg=cfg)
        model.init_from_checkpoint_if_available()
        model.test_inference()


schema = strawberry.Schema(query=Query)
app = GraphQL(schema)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
