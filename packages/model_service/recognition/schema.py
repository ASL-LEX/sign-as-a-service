import strawberry
import typing


@strawberry.type
class RecognitionResult:
    label: str

@strawberry.type
class Query:
    @strawberry.field
    def predict(self) -> typing.List[RecognitionResult]:
        return []


# Create the schema
schema = strawberry.Schema(query=Query)
