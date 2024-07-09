from argparse import ArgumentParser
from model.model import SignModel
from model.dataset import SignDataset
from torch.utils.data import DataLoader
import torch
from pathlib import Path


def one_time_load(checkpoint: dict[str, object]) -> dict[str, object]:
    """
    Handles renaming the checkpoint dictionary contents if needed. The original
    checkpoint is expected to be from the VIT based model which uses a different
    naming convention.
    """
    renamed = dict()
    renamed['model'] = dict()

    for key, value in checkpoint.items():
        if key.startswith('backbone.'):
            renamed['model'][key.replace('backbone', 'vit')] = value
    return renamed


def main():
    arg_parser= ArgumentParser()

    arg_parser.add_argument('--checkpoint',
                            required=False,
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
    arg_parser.add_argument('--output_folder',
                            required=True,
                            help='Location to store training artifacts')
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
    checkpoint = torch.load(args.checkpoint)
    checkpoint = one_time_load(checkpoint)
    model.load_state_dict(checkpoint)

    # TODO: Determine device to run on

    # Setup optimizer
    optimizer = torch.optim.SGD(
        model.linear.parameters(),
        60,  # TODO: Determine this value
        momentum=0.9,
        weight_decay=0
    )

    # Setup loss function
    loss_fn = torch.nn.CrossEntropyLoss()

    start_epoch = 0
    loss = 0

    # Load checkpoint
    if args.checkpoint:
        checkpoint = torch.load(args.checkpoint)

        model.load_state_dict(checkpoint['model'])
        optimizer.load_state_dict(checkpoint['optimizer'])
        start_epoch = checkpoint['epoch']
        loss = checkpoint['loss']

    output_directory = Path(args.output_folder)


    for epoch in range(start_epoch, args.epochs):
        train(train_loader, model, loss_fn, optimizer)
        test(test_loader, model, loss_fn)

        # Save the checkpoint
        torch.save({
            'epoch': epoch + 1,
            'model': model.state_dict(),
            'optimizer': optimizer.state_dict(),
            'loss': 0  # TODO: Get loss from test
        }, output_directory / 'model_epoch_{}.pt'.format(epoch))



def train(dataloader: DataLoader, model: torch.nn.Module, loss_fn: torch.nn.Module, optimizer: torch.optim.Optimizer) -> None:
    num_train_elements = len(dataloader.dataset)
    model.train()

    for batch, (X, y) in enumerate(dataloader):
        # Predict
        pred = model(X)
        loss = loss_fn(pred, y)

        # Backpropogate
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

        if batch % 100 == 0:
            loss, current = loss.item(), (batch + 1) * len(X)
            print(f'loss: {loss:>7f}  [{current:>5d}/{num_train_elements:>5d}]')


def test(dataloader: DataLoader, model: torch.nn.Module, loss_fn: torch.nn.Module) -> None:
    num_test_elements = len(dataloader.dataset)
    num_batches = len(dataloader)

    model.eval()

    test_loss, correct = 0, 0
    with torch.no_grad():
        for X, y in dataloader:
            pred = model(X)
            test_loss += loss_fn(pred, y).item()
            correct += (pred.argmax(1) == y).type(torch.float).sum().item()

    # TODO: Use top 5 accuracy
    test_loss /= num_batches
    correct /= num_test_elements
    print(f"Test Error: \n Accuracy: {(100*correct):>0.1f}%, Avg loss: {test_loss:>8f} \n")



if __name__ == '__main__':
    main()
