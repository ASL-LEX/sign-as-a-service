import uvicorn
import strawberry
from strawberry.asgi import GraphQL

@strawberry.type
class Query:
    @strawberry.field
    def classify(self, info) -> str:
        # TODO: Implement classification
        return "Sign code"

schema = strawberry.Schema(query=Query)
app = GraphQL(schema)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
