import redis

task_client = redis.Redis(host="localhost", port=6379, db="task_locks")


def get_global_task_lock(task_name, timeout=30, sleep=0.5, blocking_timeout=60):
    task_lock = task_client.lock(task_name, timeout=timeout, sleep=sleep, blocking_timeout=blocking_timeout)
    return task_lock
