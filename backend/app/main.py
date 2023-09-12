import uvicorn
import omegaconf
import strawberry
from strawberry.asgi import GraphQL
from typing import List, Dict, Any


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
        # return res


schema = strawberry.Schema(query=Query)
app = GraphQL(schema)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
