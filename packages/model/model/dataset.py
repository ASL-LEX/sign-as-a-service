from torch.utils.data import Dataset
from pathlib import Path
from dataclasses import dataclass
import torch
import torchvision
import csv


@dataclass
class LabeledData:
    label: str
    path: Path


class SignDataset(Dataset):
    def __init__(self, csv_path: Path):
        # Load in the labeled data
        self.labeled_data: list[LabeledData] = []
        with open(csv_path, 'r') as csv_file:
            csv_data = csv.DictReader(csv_file)
            self.labeled_data = [LabeledData(row['label'], Path(row['path'])) for row in csv_data]


    def __len__(self):
        return len(self.labeled_data)

    def __getitem__(self, index: int) -> tuple[torch.Tensor, str]:
        if index > len(self.labeled_data):
            raise IndexError()

        data = self.labeled_data[index]

        # Read in the video
        video = torchvision.io.read_video(str(data.path))[0]
        return video, data.label
