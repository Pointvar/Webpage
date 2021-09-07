if __name__ == "__main__":
    import os
    import sys

    sys.path.append(os.path.join(os.path.dirname(__file__), "../../../"))
    from compass_warp.compass_conf.set_env import set_path_env

    set_path_env()

from compass_warp.service.copy_service import CopyService

import logging

logger = logging.getLogger(__name__)


def process_main():
    sid, nick, platform, soft_code, source = "", "", "pinduoduo", "kjsh", "script-check_copy_paste"
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    wait_task = copy_service.get_check_copy_complex_task()
    keys = ["dst_num_iid", "_id", "sid", "nick", "platform", "soft_code"]
    num_iid, in_id, sid, nick, platform, soft_code = [wait_task[key] for key in keys]
    # 重新生成copy_service
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    try:
        import pdb

        pdb.set_trace()
        commit_info = copy_service.get_pdd_goods_commit_status([num_iid])[0]
        check_status = commit_info["check_status"]
        if check_status == 3:
            check_fail_msg = commit_info["reject_comment"]
            update_dict = dict(check_status="#FAIL#", check_fail_msg=check_fail_msg)
        else:
            update_dict = dict(check_status="#FINISH#")
        copy_service.update_complex_task_by_params(in_id, update_dict)
    except Exception as ex:
        update_dict = dict(check_status="#FAIL#", check_fail_msg="xxx")
        copy_service.update_complex_task_by_params(in_id, update_dict)


if __name__ == "__main__":
    process_main()