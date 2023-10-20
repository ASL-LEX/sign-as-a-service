from recognition.schema import schema

from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import aiofiles
from recognition.transform import Transform
from pathlib import Path


app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_headers=["*"], allow_origins=["*"], allow_methods=["*"]
)

transform = Transform(128)


@app.post('/upload')
async def upload_file(file: UploadFile):
    async with aiofiles.open('here.webm', 'wb') as output_file:
        # Store the file in an intermediate location
        content = await file.read()
        await output_file.write(content)

        # Process the video into a tensor
        transform.apply(Path('./here.webm'), Path('here.pt'))
    return 'success'



graphql_app = GraphQLRouter(schema)

app.include_router(graphql_app, prefix='/graphql')
