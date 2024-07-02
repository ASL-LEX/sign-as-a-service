from argparse import ArgumentParser
import csv
from dataclasses import dataclass
from pathlib import Path
import re
from google.cloud import storage
import os


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
    BASE_URL = 'https://console.cloud.google.com/storage/browser/_details/asl-lex-prod.appspot.com/'

    results: list[CSVData] = []

    with open(csv_location, 'r') as csv_file:
        csv_data = csv.DictReader(csv_file)
        # Convert the data row-by-row in CSVData
        for row in csv_data:
            gcp_location_raw = row['Response Video URL']
            label = row['Tag Text']

            # The GCP location needs to be formatted where the bucket location
            # needs to be extracted
            #
            # Example Below
            # https://console.cloud.google.com/storage/browser/_details/asl-lex-prod.appspot.com/Responses/7/tree_response-3.webm
            gcp_location = gcp_location_raw.split(BASE_URL)[-1]
            results.append(CSVData(gcp_location=gcp_location, label=label))

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


def download_data(csv_data: list[CSVData], video_folder: Path, bucket_name: str) -> list[DownloadedData]:
    """
    Download the data from the GCP location to local storage, the resulting
    absolute path will be recorded
    """
    # Get the GCP client
    client = storage.Client()

    # Get the bucket
    bucket = client.bucket(bucket_name)

    # Determine the base path to store all the files
    base_path = Path(os.path.abspath(video_folder))

    results: list[DownloadedData] = []

    # Create the director to store the results
    video_folder.mkdir(parents=True, exist_ok=True)

    # Iterate over the files and download each one
    for row in csv_data:
        # Determine where to save the file
        file_name = row.gcp_location.replace('/', '_')
        file_location = base_path / file_name

        # Download the file to the specified location
        blob = bucket.blob(row.gcp_location)
        blob.download_to_filename(file_location)

        # Keep track of the file location
        results.append(DownloadedData(path=str(file_location), label=row.label))

    return results


def save_csv(download_data: list[DownloadedData], csv_location: Path) -> None:
    with open(csv_location, 'w') as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=['label','path'])
        writer.writeheader()

        for row in download_data:
            writer.writerow({ 'label': row.label, 'path': row.path })


def main():
    arg_parser = ArgumentParser(description=info)
    arg_parser.add_argument('--csv',
                            required=True,
                            help='CSV of labeled ASL-LEX data')
    arg_parser.add_argument('--output',
                            required=True,
                            help='Folder location to store dataset artifacts')
    arg_parser.add_argument('--bucket',
                            required=True,
                            help='The name of the bucket where the files are located')

    args = arg_parser.parse_args()

    output_directory = Path(args.output)

    # Read in the data unfiltered
    unfiltered_data = read_csv(Path(args.csv))
    print('Found {} unfiltered rows'.format(len(unfiltered_data)))

    # Filter the data
    filtered_data = filter_data(unfiltered_data)
    print('Found {} filtered rows'.format(len(filtered_data)))

    # Download the data locally
    downloaded_data = download_data(filtered_data, output_directory / 'videos', args.bucket)

    # Store the CSV containing the label and video information
    save_csv(downloaded_data, output_directory / 'labels.csv')


if __name__ == '__main__':
    main()
