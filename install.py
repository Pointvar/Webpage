import os
import argparse
import subprocess

base_path = os.path.dirname(os.path.abspath(__file__))

def process_main(env_type):
    org_url = 'compass_warp/conf/{env_type}/settings.py'.format(env_type=env_type)
    dst_url = 'compass_warp/compass/settings.py'
    org_path = os.path.join(base_path, org_url)
    dst_path = os.path.join(base_path, dst_url)
    if os.path.exists(dst_path):
       os.remove(dst_path)
    os.symlink(org_path, dst_path)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='配置文件初始化')
    parser.add_argument('-T', '--env_type', choices=['dev', 'prd', 'qas'], required=True, help='指定初始化环境')
    args = parser.parse_args()
    env_type = args.env_type
    process_main(env_type)
