import os
import sys


def set_path_env():
    dir_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
    for path in ["Webpage", "Commons"]:
        pro_path = os.path.join(dir_path, path)
        if pro_path not in sys.path:
            sys.path.append(pro_path)
