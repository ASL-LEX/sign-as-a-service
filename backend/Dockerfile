# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install dependencies
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0

# Set work directory in the container
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
COPY app/sign_recognizer.ckpt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the current directory contents into the container
COPY ./app /app

# Run the command to start Uvicorn
CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8000"]
