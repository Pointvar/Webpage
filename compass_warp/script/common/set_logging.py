import os
import yaml
import logging.config

logging_yaml = os.path.abspath(os.path.join(os.path.abspath(__file__), "../logging.yaml"))


def set_logging_by_yaml(script_name):
    with open(logging_yaml) as file_handler:
        logging_dict = yaml.safe_load(file_handler.read())
        logging_path = logging_dict["handlers"]["file"]["filename"]

        logging_dict["handlers"]["file"]["filename"] = "".join([logging_path, script_name, ".log"])
    logging.config.dictConfig(logging_dict)
