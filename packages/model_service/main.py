from recognition.schema import schema

from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import aiofiles


app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_headers=["*"], allow_origins=["*"], allow_methods=["*"]
)

@app.post('/upload')
async def upload_file(file: UploadFile):
    async with aiofiles.open('here.webm', 'wb') as output_file:
        content = await file.read()
        await output_file.write(content)


graphql_app = GraphQLRouter(schema)

app.include_router(graphql_app, prefix='/graphql')
