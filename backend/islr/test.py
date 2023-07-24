import omegaconf
from openhands.apis.inference import InferenceModel

if __name__ == "__main__":
    cfg = omegaconf.OmegaConf.load("./config.yaml")
    model = InferenceModel(cfg=cfg)
    model.init_from_checkpoint_if_available()
    if cfg.data.test_pipeline.dataset.inference_mode:
        model.test_inference()
    else:
        model.compute_test_accuracy()
