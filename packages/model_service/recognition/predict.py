import typing
import torch
import os
from recognition.model import r2plus1d_18
from collections import OrderedDict
import json

with open('labels.json', 'r') as labels_file:
    labels = json.load(labels_file)


image_size = 128
checkpoint_file = '/home/cbolles/devel/temp/saas/final_models_finetuned/rgb_final_finetuned.pth'

# PyTorch setup
os.environ['CUDA_VISIBLE_DEVICES']='0'
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load model
model = r2plus1d_18(pretrained=True, num_classes=226)

# Restore model from checkpoint
checkpoint = torch.load(checkpoint_file)
new_state_dict = OrderedDict()
for k, v in checkpoint.items():
    name = k[7:]
    new_state_dict[name] = v
model.load_state_dict(new_state_dict)
model = model.to(device)
# Run the model parallelly
if torch.cuda.device_count() > 1:
    print('Using {} GPUs'.format(torch.cuda.device_count()))
    model = torch.nn.DataParallel(model)


def predict() -> typing.List[str]:
    model_predictions = []

    """
    images = []
    for section_path in os.listdir('./sections'):
        images.append(torch.load(os.path.join('./sections', section_path)))
    images = torch.stack(images, dim=0)
    images = images.reshape((1, *images.size()))
    print(images.shape)
    images = images.to(device)
    """

    model.eval()
    with torch.no_grad():
        for section_path in os.listdir('./sections'):
        # for i_clip in range(images.size(1)):
            # Load section from file system
            section = torch.load(os.path.join('./sections', section_path)).to(device)

            # Generate prediction across section
            model_predictions.append(model(section))
            # model_predictions.append(model(images[:,i_clip,:,:]))
            # print(model_predictions)

            # Free memory
            del section
            torch.cuda.empty_cache()

    average_predictions = torch.mean(torch.stack(model_predictions, dim=0), dim=0)
    top_predictions = torch.topk(average_predictions, 5)[1]

    prediction_labels = []
    for prediction in top_predictions.tolist()[0]:
        prediction_labels.append(labels[str(prediction)])

    return prediction_labels

