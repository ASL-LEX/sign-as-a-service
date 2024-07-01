from argparse import ArgumentParser
import csv
from dataclasses import dataclass
from pathlib import Path
import re


info = '''
    Utility for download the ASL-LEX dataset in a manner that allows for loading
    in a cooresponding Pytorch Dataset.
'''


@dataclass
class CSVData:
    """
    Represents the data from the tag CSV that needs to be read.
    """
    gcp_location: str
    label: str

@dataclass
class DownloadedData:
    """
    Represents the data after the video has been download from GCP
    """
    path: str
    label: str


def read_csv(csv_location: Path) -> list[CSVData]:
    """
    Reads in the CSV data and produces a list of CSVData.

    NOTE: The data will not be filtered in this step
    """
    with open(csv_location, 'r') as csv_file:
        csv_data = csv.DictReader(csv_file)
        # Convert the data row-by-row in CSVData
        results = [CSVData(gcp_location=row['Response Video URL'], label=row['Tag Text']) for row in csv_data]
    return results


def filter_data(csv_data: list[CSVData]) -> list[CSVData]:
    """
    Filter the CSV data to only include data that meets the requirements

    1. Label is not empty
    2. Label follows the format "<LETTER>_..." (only ASL-LEX labeled data)
    """
    regex_express = re.compile(r'^[A-Z]_.*')

    # Apply the regex matching to each row
    return list(filter(lambda row: regex_express.search(row.label) is not None, csv_data))


def download_data(csv_data: list[CSVData], video_folder: Path) -> list[DownloadedData]:
    """
    Download the data from the GCP location to local storage, the resulting
    absolute path will be recorded
    """
    return []


def save_csv(download_data: list[DownloadedData], csv_location: Path) -> None:
    pass


def main():
    arg_parser = ArgumentParser(description=info)
    arg_parser.add_argument('--csv',
                            required=True,
                            help='CSV of labeled ASL-LEX data')
    arg_parser.add_argument('--output',
                            required=True,
                            help='Folder location to store dataset artifacts')
    arg_parser.add_argument('--gcp',
                            required=True,
                            help='Location of GCP service account JSON file to handle download')

    args = arg_parser.parse_args()

    output_directory = Path(args.output)

    # Read in the data unfiltered
    unfiltered_data = read_csv(Path(args.csv))

    # Filter the data
    filtered_data = filter_data(unfiltered_data)

    # Download the data locally
    downloaded_data = download_data(filtered_data, output_directory / 'videos')

    # Store the CSV containing the label and video information
    save_csv(downloaded_data, output_directory / 'labels.csv')


if __name__ == '__main__':
    main()
