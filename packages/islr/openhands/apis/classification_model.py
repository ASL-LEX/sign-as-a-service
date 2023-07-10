import torch
import torch.nn.functional as F
import torchmetrics
from ..models.loader import get_model
from ..core.losses import CrossEntropyLoss, SmoothedCrossEntropyLoss
from ..core.data import DataModule
from .inference import InferenceModel
import json

class ClassificationModel(InferenceModel):
    """
    Classification Model initializer

    Args:
        cfg (dict): configuration set.
        trainer (object): trainer object from Pytorch Lightning.

    """
    def __init__(self, cfg, trainer):
        super().__init__(cfg, stage="fit")
        self.trainer = trainer
        self.setup_metrics()
        self.loss = self.setup_loss(self.cfg.optim)


    def training_step(self, batch, batch_idx):
        """
        Lightning calls this inside the training loop with the data from the training dataloader
        passed in as `batch` and calculates the loss and the accuracy.
        """
        params = self.cfg.data.train_pipeline.parameters
        y_hat, y_hat_params = self.model(batch["frames"])

        total_loss = 0.0
        total_acc = 0.0
        n_params = len(params)

        for p in params:
            if p == "gloss":
                total_loss += self.loss(y_hat, batch["labels"])
                total_acc += self.accuracy_metric(F.softmax(y_hat, dim=-1), batch["labels"]) 
            else:
                total_loss += self.loss(y_hat_params[p], batch["params"][p])
                total_acc += self.accuracy_metric(F.softmax(y_hat_params[p], dim=-1), batch["params"][p])
        total_acc /= len(params)

        self.log("train_loss", total_loss)
        self.log("train_acc", total_acc, on_step=False, on_epoch=True, prog_bar=True)

        return {"loss": total_loss, "train_acc": total_acc}

    def validation_step(self, batch, batch_idx):
        """
        Lightning calls this inside the training loop with the data from the validation dataloader
        passed in as `batch` and calculates the loss and the accuracy.
        """
        params = self.cfg.data.valid_pipeline.parameters
        y_hat, y_hat_params = self.model(batch["frames"])

        total_loss = 0.0
        total_acc = 0.0
        n_params = len(params)

        for p in params:
            if p == "gloss":
                total_loss += self.loss(y_hat, batch["labels"])
                acc = self.accuracy_metric(F.softmax(y_hat, dim=-1), batch["labels"]) 
            else:
                total_loss += self.loss(y_hat_params[p], batch["params"][p])
                acc = self.accuracy_metric(F.softmax(y_hat_params[p], dim=-1), batch["params"][p])
            total_acc += acc
            self.log(p + "_acc", acc, on_step=False, on_epoch=True, prog_bar=True)
        total_acc /= len(params)

        self.log("val_loss", total_loss)
        self.log("val_acc", total_acc, on_step=False, on_epoch=True, prog_bar=True)

        return {"valid_loss": total_loss, "valid_acc": total_acc}

    def configure_optimizers(self):
        """
        Returns the optimizer and the LR scheduler to be used by Lightning.
        """
        return self.get_optimizer(self.cfg.optim)

    def setup_loss(self, conf):
        """
        Initializes the loss function based on the loss parameter mentioned in the config.
        """
        loss = conf.loss
        assert loss in ["CrossEntropyLoss", "SmoothedCrossEntropyLoss"]
        if loss == "CrossEntropyLoss":
            return CrossEntropyLoss(ignore_index=-1)
        return SmoothedCrossEntropyLoss()

    def setup_metrics(self):
        """
        Intializes metric to be logged. Accuracy is used here currently.
        """
        self.accuracy_metric = torchmetrics.functional.accuracy

    def get_optimizer(self, conf):
        """
        Parses the config and creates the optimizer and the LR scheduler.
        """
        optimizer_conf = conf["optimizer"]
        optimizer_name = optimizer_conf.get("name")
        optimizer_params = {}
        if hasattr(optimizer_conf, "params"):
            optimizer_params = optimizer_conf.params

        optimizer = getattr(torch.optim, optimizer_name)(
            params=self.model.parameters(), **optimizer_params
        )

        if "scheduler" not in conf:
            return [optimizer]

        scheduler_conf = conf["scheduler"]
        scheduler_name = scheduler_conf.get("name")
        scheduler_params = {}
        if hasattr(scheduler_conf, "params"):
            scheduler_params = scheduler_conf.params
        scheduler = getattr(torch.optim.lr_scheduler, scheduler_name)(
            optimizer=optimizer, **scheduler_params
        )

        return [optimizer], [scheduler]

    def fit(self):
        """
        Method to be called to start the training.
        """
        self.trainer.fit(self, self.datamodule)
