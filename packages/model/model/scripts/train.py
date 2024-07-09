from argparse import ArgumentParser
from model.model import SignModel


def main():
    arg_parser= ArgumentParser()

    arg_parser.add_argument('--check-point',
                            required=True,
                            help='Location of checkpoint file to load')
    arg_parser.add_argument('--labels',
                            required=True,
                            help='Location of the sign data CSV')



if __name__ == '__main__':
    main()
