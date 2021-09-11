import os
import sys
import time
import jieba
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../"))
from compass_warp.compass_conf.set_env import set_path_env
from compass_warp.script.common.set_logging import set_logging_by_yaml

jieba.initialize()
set_path_env()
set_logging_by_yaml("copy_paste")
from compass_warp.service.copy_service import CopyService

import logging

logger = logging.getLogger(__name__)


def process_main():
    logger.info("[Step 1] [Process] input %s", datetime.now())
    sid, nick, platform, soft_code, source = "", "", "pinduoduo", "kjsh", "script-copy_paste"
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    wait_task = copy_service.get_wait_copy_complex_task()
    if not wait_task:
        logger.info("[Step finally] [Return] Reason: no wait task")
        return
    keys = ["src_num_iid", "item_source", "task_id", "_id", "sid", "nick", "platform", "soft_code"]
    num_iid, item_source, task_id, in_id, sid, nick, platform, soft_code = [wait_task[key] for key in keys]
    # 重新生成copy_service
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    try:
        simple_task = copy_service.get_copy_simple_task(task_id)
        logger.info("[Step 2] [Process] [TaskInfo] task_id:%s nick:%s src_num_iid:%s", task_id, nick, num_iid)
        update_dict = dict(status="#PROCESS#", process_step=15)
        copy_service.update_complex_task_by_params(in_id, update_dict)
        # 抓取淘宝商品信息
        item_dict = copy_service.get_taobao_item_api(num_iid)
        logger.info("[Step 3] [Process] [GetItem] task_id:%s item_dict:%s", task_id, item_dict)
        # 解析淘宝商品信息
        item_dict = copy_service.parse_taobao_item_api(item_dict)
        logger.info("[Step 4] [Process] [ParseItem] task_id:%s item_dict:%s", task_id, item_dict)

        # 更新记录内的标题和主图
        itme_title = item_dict["base_info"]["title"]
        main_pic = item_dict["base_info"]["main_pics"][0]
        update_dict = dict(itme_title=itme_title, main_pic=main_pic, status="#PROCESS#", process_step=45)
        copy_service.update_complex_task_by_params(in_id, update_dict)

        # 数据转换成拼多多数据
        keys = ["item_set", "price_set", "advanced_set"]
        item_set, price_set, advanced_set = [simple_task[key] for key in keys]
        pdd_submit = copy_service.parser_item_to_pdd(item_dict, item_set, price_set, advanced_set)
        update_dict = dict(itme_title=itme_title, main_pic=main_pic, status="#PROCESS#", process_step=65)
        logger.info("[Step 5] [Process] [ChangeData] task_id:%s pdd_submit:%s", task_id, pdd_submit)

        copy_service.update_complex_task_by_params(in_id, update_dict)
        # 上传图片数据到拼多多
        pdd_submit = copy_service.process_submit_by_upload_images(pdd_submit, item_source)
        logger.info("[Step 6] [Process] [UploadPic] task_id:%s pdd_submit:%s", task_id, pdd_submit)
        update_dict = dict(itme_title=itme_title, main_pic=main_pic, status="#PROCESS#", process_step=95)
        copy_service.update_complex_task_by_params(in_id, update_dict)
        dst_num_iid, submit_id = copy_service.add_pdd_item(pdd_submit)
        logger.info("[Step 7] [Process] [AddItem] task_id:%s dst_num_iid:%s submit_id:%s", task_id, dst_num_iid, submit_id)
        # 复制完成后更新记录
        update_dict = dict(dst_num_iid=dst_num_iid, submit_id=submit_id, status="#FINISH#", check_status="#PROCESS#")
        copy_service.update_complex_task_by_params(in_id, update_dict)
        logger.info("[Step finally] [Finish] task_id:%s nick:%s ", task_id, nick)
    except Exception as ex:
        logger.exception("[Step finally] [Fail] task_id:%s nick:%s exception:%s", task_id, nick, ex)
        exception_msg = str(ex)
        update_dict = dict(status="#FAIL#", exception_msg=exception_msg)
        copy_service.update_complex_task_by_params(in_id, update_dict)


if __name__ == "__main__":
    while True:
        process_main()
        time.sleep(0.5)
