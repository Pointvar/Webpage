import subprocess

USERNAME = "Pointvar"
PATHS = ["Archive", "Website"]
GIT_URL = "git clone git@github.com:{username}/{path}.git"

for PATH in PATHS:
    call_str = GIT_URL.format(username=USERNAME, path=PATH)
    subprocess.call(call_str, shell=True)
