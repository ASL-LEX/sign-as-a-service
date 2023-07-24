import uvicorn
import omegaconf
import strawberry
from strawberry.asgi import GraphQL
from typing import List, Dict, Any
from .islr.openhands.apis.inference import InferenceModel


@strawberry.type
class PredictionResult:
    id: str
    true: str
    preds: List[str]  # Assuming the predictions are strings, adjust as needed


@strawberry.type
class Query:
    @strawberry.field
    def classify(self, info) -> List[PredictionResult]:
        cfg = omegaconf.OmegaConf.load("./config.yaml")
        model = InferenceModel(cfg=cfg)
        model.init_from_checkpoint_if_available()
        res = model.predict()
        return res


schema = strawberry.Schema(query=Query)
app = GraphQL(schema)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
