import torch
import pytorch_lightning as pl
from tqdm import tqdm
import time, json
import numpy as np

from ..core.data import DataModule
from ..models.loader import get_model
from sklearn.metrics import confusion_matrix
import numpy as np

PARAMS = [
    "Handshape",
    "Selected Fingers",
    "Flexion",
    "Spread",
    "Spread Change",
    "Thumb Position",
    "Thumb Contact",
    "Sign Type",
    "Path Movement",
    "Repeated Movement",
    "Major Location",
    "Minor Location",
    "Second Minor Location",
    "Contact",
    "Nondominant Handshape",
    "Wrist Twist",
    "Handshape Morpheme 2",
]


# merge with the corresponding modules in the future release.
class InferenceModel(pl.LightningModule):
    """
    This will be the general interface for running the inference across models.
    Args:
        cfg (dict): configuration set.
    """

    def __init__(self, cfg, stage="test"):
        super().__init__()
        self.cfg = cfg
        self.datamodule = DataModule(cfg.data)
        self.datamodule.setup(stage=stage)

        self.model = self.create_model(cfg.model)

        # if we are learning an adapter, we might want to freeze the rest of the model (if it exists)
        if cfg.model.learn_adapter:
            if cfg.pretrained or cfg.trainer.resume_from_checkpoint:
                self.freeze_model()

        self._device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
        if stage == "test":
            self.model.to(self._device).eval()

    def create_model(self, cfg):
        """
        Creates and returns the model object based on the config.
        """
        params = {p: self.datamodule.num_param[p] for p in PARAMS}
        return get_model(
            cfg, self.datamodule.in_channels, self.datamodule.num_class, params
        )

    def freeze_model(self, include_adapters=False):
        print("[Adapters] Freezing non-adapter parameters...")
        encoder_layers = self._modules["model"].encoder._modules.items()
        # decoder_layers = self._modules["model"].decoder._modules.items()

        for name, layer in list(encoder_layers):  # +list(decoder_layers):
            for component_name, component in layer._modules.items():
                if "adapter" in component_name and not include_adapters:
                    continue

                for param in component.parameters():
                    param.requires_grad = False

    def forward(self, x):
        """
        Forward propagates the inputs and returns the model output.
        """
        return self.model(x)

    def init_from_checkpoint_if_available(self, map_location=torch.device("cpu")):
        """
        Intializes the pretrained weights if the ``cfg`` has ``pretrained`` parameter.
        """
        if "pretrained" not in self.cfg.keys() or self.cfg.pretrained == None:
            return

        ckpt_path = self.cfg["pretrained"]
        print(f"Loading checkpoint from: {ckpt_path}")
        ckpt = torch.load(ckpt_path, map_location=map_location)
        self.load_state_dict(ckpt["state_dict"], strict=False)
        del ckpt

    def predict(self):
        results = []
        splits = json.load(open(self.cfg.data.test_pipeline.dataset.split_file))
        path2gloss = {
            instance["video_id"]: sign["gloss"]
            for sign in splits
            for instance in sign["instances"]
        }
        id2gloss = self.datamodule.test_dataset.id_to_gloss
        dataloader = self.datamodule.test_dataloader()

        print(dataloader)

        for batch in dataloader:
            print(f'batch: {batch}')
            y_hat = self.model(batch["frames"].to(self._device))
            y_true = [
                path2gloss[path.split("/")[-1].replace(".pkl", "")]
                if path.split("/")[-1].replace(".pkl", "") in path2gloss.keys()
                else None
                for path in batch["files"]
            ]

            y_hat_gloss = y_hat[0].cpu()

            for sample_idx, gloss_probs in enumerate(y_hat_gloss):
                if not y_true[sample_idx]:
                    continue
                sample_preds = {id2gloss[i]: prob for i, prob in enumerate(gloss_probs)}
                rankings, probs = zip(
                    *sorted(sample_preds.items(), key=lambda x: x[1], reverse=True)
                )
                if y_true[sample_idx] not in rankings:
                    continue
                row = {
                    "id": batch["files"][sample_idx].split("/")[-1].replace(".pkl", ""),
                    "true": y_true[sample_idx],
                    "preds": rankings[:10],
                }
                results.append(row)
        
        return results

    def compute_test_accuracy(self):
        """
        Computes the accuracy for the test dataloader.
        """
        # Ensure labels are loaded
        assert not self.datamodule.test_dataset.inference_mode
        # TODO: Write output to a csv
        dataloader = self.datamodule.test_dataloader()
        dataset_scores, class_scores = {}, {}
        for batch_idx, batch in tqdm(enumerate(dataloader), unit="batch"):
            y_hat = self.model(batch["frames"].to(self._device)).cpu()
            class_indices = torch.argmax(y_hat, dim=-1)
            for i, (pred_index, gt_index) in enumerate(
                zip(class_indices, batch["labels"])
            ):
                dataset_name = batch["dataset_names"][i]
                score = pred_index == gt_index

                if dataset_name not in dataset_scores:
                    dataset_scores[dataset_name] = []
                dataset_scores[dataset_name].append(score)

                if gt_index not in class_scores:
                    class_scores[gt_index] = []
                class_scores[gt_index].append(score)

        for dataset_name, score_array in dataset_scores.items():
            dataset_accuracy = sum(score_array) / len(score_array)
            print(
                f"Accuracy for {len(score_array)} samples in {dataset_name}: {dataset_accuracy*100}%"
            )

        classwise_accuracies = {
            class_index: sum(scores) / len(scores)
            for class_index, scores in class_scores.items()
        }
        avg_classwise_accuracies = sum(classwise_accuracies.values()) / len(
            classwise_accuracies
        )

        print(f"Average of class-wise accuracies: {avg_classwise_accuracies*100}%")

    def compute_test_avg_class_accuracy(self):
        """
        Computes the accuracy for the test dataloader.
        """
        # Ensure labels are loaded
        assert not self.datamodule.test_dataset.inference_mode
        # TODO: Write output to a csv
        dataloader = self.datamodule.test_dataloader()
        scores = []
        all_class_indices = []
        all_batch_labels = []
        for batch_idx, batch in tqdm(enumerate(dataloader), unit="batch"):
            y_hat = self.model(batch["frames"].to(self._device)).cpu()
            class_indices = torch.argmax(y_hat, dim=-1)

            for i in range(len(batch["labels"])):
                all_batch_labels.append(batch["labels"][i])
                all_class_indices.append(class_indices[i])
            for pred_index, gt_index in zip(class_indices, batch["labels"]):
                scores.append(pred_index == gt_index)
        cm = confusion_matrix(np.array(all_batch_labels), np.array(all_class_indices))
        cm = cm.astype("float") / cm.sum(axis=1)[:, np.newaxis]
        print(
            f"Average Class Accuracy for {len(all_batch_labels)} samples: {np.mean(cm.diagonal())*100}%"
        )
