from argparse import ArgumentParser
from sklearn.model_selection import train_test_split
import pandas as pd


info = '''
    Utility for splitting the ASL-LEX dataset into a test and train dataset.
    The utility will attempt to split the data based on the labeled data.
    So with a test/train split of 30/70 then 30% of data with a given
    label will be part of the test set
'''


def main():
    arg_parser = ArgumentParser(description=info)
    arg_parser.add_argument('csv',
                            help='The origin CSV of the labeled data to split')
    arg_parser.add_argument('test',
                            help='Location to store the test CSV')
    arg_parser.add_argument('train',
                            help='Location to store the train CSV')
    arg_parser.add_argument('--test-split',
                            default=0.2,
                            type=float,
                            help='Percent as a value 0-1 representing the test split')

    args = arg_parser.parse_args()

    # Load the original via pandas
    original = pd.read_csv(args.csv)

    # Split data into the data and labels
    data = original['path']
    labels = original['label']

    # Leverage sklearn's split method
    split_data = train_test_split(data, labels, stratify=labels, test_size=args.test_split)

    # Now store the split data back into CSVs for easy loading
    train_data = pd.DataFrame(data={'label': split_data[2], 'path': split_data[0]})
    test_data = pd.DataFrame(data={'label': split_data[3], 'path': split_data[1]})

    train_data.to_csv(args.train)
    test_data.to_csv(args.test)


if __name__ == '__main__':
    main()
