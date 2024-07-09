from argparse import ArgumentParser
import pandas as pd

info = '''
    Utility for generating the ID mapping between a number an an ASL-LEX
    code
'''


def main():
    arg_parser = ArgumentParser(description=info)
    arg_parser.add_argument('csv',
                            help='The signlab CSV data which contains the ASL-LEX codes')
    arg_parser.add_argument('output',
                            help='Where to store the mapping file of numeric ID to ASL-LEX code')

    args = arg_parser.parse_args()

    # Load the original sign dataset
    original = pd.read_csv(args.csv, encoding='latin-1')

    # Keep only the ASL-LEX codes
    mapping = original['Code']

    # Use the pandas index as the ID
    mapping.to_csv(args.output, index_label='ID')


if __name__ == '__main__':
    main()
