import os
import sys
import time
from datetime import datetime, timedelta

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../"))
from compass_warp.compass_conf.set_env import set_path_env
from compass_warp.script.common.set_logging import set_logging_by_yaml

set_path_env()
set_logging_by_yaml("check_copy_paste")
from compass_warp.service.copy_service import CopyService

import logging

logger = logging.getLogger(__name__)


def process_main():
    logger.info("[Step 1] [Process] input %s", datetime.now())
    sid, nick, platform, soft_code, source = "", "", "pinduoduo", "kjsh", "script-check_copy_paste"
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    wait_task = copy_service.get_check_copy_complex_task()
    if not wait_task:
        logger.info("[Step finally] [Return] Reason: no wait task")
        return
    keys = ["dst_num_iid", "submit_id", "_id", "task_id", "sid", "nick", "platform", "soft_code", "check_count"]
    num_iid, submit_id, in_id, task_id, sid, nick, platform, soft_code, check_count = [wait_task[key] for key in keys]
    check_count += 1
    # 重新生成copy_service
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    try:
        logger.info("[Step 2] [Process] [TaskInfo] in_id:%s nick:%s submit_id:%s", in_id, nick, submit_id)
        commit_info = copy_service.get_pdd_goods_commit_status([submit_id])
        logger.info("[Step 3] [Process] [GetStatus] in_id:%s commit_info:%s", in_id, commit_info)
        if not commit_info or commit_info[0]["check_status"] not in [2, 3]:
            # 平台未返回信息,延时检查
            if check_count <= 3:
                check_time = datetime.now() + timedelta(seconds=check_count * 30)
                update_dict = dict(check_count=check_count, check_time=check_time)
            else:
                update_dict = dict(check_status="#FAIL#", check_fail_msg="已经反复检查3次，未查询到相关信息。")
            copy_service.update_complex_task_by_params(in_id, update_dict)
            return
        commit_info = commit_info[0]
        check_status = commit_info["check_status"]

        if check_status == 3:
            check_fail_msg = commit_info["reject_comment"]
            update_dict = dict(check_status="#FAIL#", check_fail_msg=check_fail_msg)
        else:
            update_dict = dict(check_status="#FINISH#")
            # 用户选择仓库中，下架商品。
            simple_task = copy_service.get_copy_simple_task(task_id)
            item_status = simple_task["item_set"]["item_status"]
            if item_status == "#STOCK#":
                copy_service.set_pdd_goods_status(num_iid, 0)
        copy_service.update_complex_task_by_params(in_id, update_dict)
    except Exception as ex:
        logger.exception("[Step finally] [Fail] task_id:%s nick:%s exception:%s", task_id, nick, ex)
        check_fail_msg = repr(ex)
        update_dict = dict(check_status="#FAIL#", check_fail_msg=check_fail_msg)
        copy_service.update_complex_task_by_params(in_id, update_dict)


if __name__ == "__main__":
    while True:
        process_main()
        time.sleep(0.5)
