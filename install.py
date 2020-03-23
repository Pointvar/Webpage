import subprocess
from os import path

base_path = path.dirname(path.abspath(__file__))

def process_main(env_type):
    org_url = 'compass_warp/conf/{env_type}/settings.py'.format(env_type=env_type)
    dst_url = 'compass_warp/compass/settings.py'
    org_path = path.join(base_path, org_url)
    dst_path = path.join(base_path, dst_url)
    shell_str = "ln -s {org_path} {dst_path}".format(org_path=org_path, dst_path=dst_path)
    subprocess.call(shell_str, shell=True)

if __name__ == "__main__":
    process_main("dev")
