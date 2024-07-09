from argparse import ArgumentParser
from model.model import SignModel
from model.dataset import SignDataset
from torch.utils.data import DataLoader
import torch


def rename_checkpoint(checkpoint: dict[str, object]) -> dict[str, object]:
    """
    Handles renaming the checkpoint dictionary contents if needed. The original
    checkpoint is expected to be from the VIT based model which uses a different
    naming convention.
    """
    renamed = dict()

    for key, value in checkpoint.items():
        if key.startswith('backbone.'):
            renamed[key.replace('backbone', 'vit')] = value
        else:
            renamed[key] = value
    return renamed


def main():
    arg_parser= ArgumentParser()

    arg_parser.add_argument('--check-point',
                            required=True,
                            help='Location of checkpoint file to load')
    arg_parser.add_argument('--train',
                            required=True,
                            help='Location of the train sign data CSV')
    arg_parser.add_argument('--test',
                            required=True,
                            help='Location of the test sign data CSV')
    arg_parser.add_argument('--epochs',
                            required=False,
                            type=int,
                            default=100)
    args = arg_parser.parse_args()

    # Make the data sets
    train_dataset = SignDataset(args.train)
    test_dataset = SignDataset(args.test)

    # Setup the data loader
    train_loader = DataLoader(train_dataset)
    test_loader = DataLoader(test_dataset)

    # Setup the model
    model = SignModel()

    # Load in a checkpoint file
    checkpoint = torch.load(args.check_point)
    checkpoint = rename_checkpoint(checkpoint)
    model.load_state_dict(checkpoint)

    # TODO: Determine device to run on

    # Setup optimizer
    optimizer = torch.optim.SGD(
        model.linear.parameters(),
        60,  # TODO: Determine this value
        momentum=0.9,
        weight_decay=0
    )
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, args.epochs, eta_min=0)



if __name__ == '__main__':
    main()
