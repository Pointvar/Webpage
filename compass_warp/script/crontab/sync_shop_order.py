from datetime import datetime
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../"))
from compass_warp.compass_conf.set_env import set_path_env

set_path_env()
import time
import math

from pdd_models.search_pdd_vas_order import SearchPddVasOrder
from db_models.shop_infos.shop_order_db import ShopOrderDB
from db_models.order_infos.pdd_order_db import PddOrderDB

import logging

logger = logging.getLogger(__name__)


def process_main(start_time, end_time):
    platform, soft_code = "pinduoduo", "kjsh"
    user_info = dict(sid="", nick="", platform=platform, soft_code=soft_code)
    vas_order_api = SearchPddVasOrder(user_info, "crontab_sync_order")
    shop_orders = vas_order_api.search_pdd_vas_order(start_time, end_time)
    for shop_order in shop_orders:
        # 先存入拼多多元素订单信息。然后判断是否是有效订单，有效订单存入shop_order。
        sid, nick = [shop_order[key] for key in ["mall_id", "mall_name"]]
        pdd_order_db = PddOrderDB(sid, nick, platform, soft_code)
        pdd_order_db.save_pdd_order(shop_order)

        pay_status = shop_order["pay_status"]
        refund_status = shop_order["refund_status"]
        if pay_status != 1 or refund_status != 0:
            continue

        keys = ["order_sn", "amount", "create_time", "pay_time", "time_length"]
        order_id, total_fee, create_time, pay_time, time_length = [shop_order[key] for key in keys]
        extra_keys = ["sku_spec", "sku_id", "service_id"]
        item_name, item_code, article_code = [shop_order[key] for key in extra_keys]
        order_type, activity_code = None, None

        shop_order_db = ShopOrderDB(sid, nick, platform, soft_code)
        fee_dict = dict(total_fee=total_fee, prom_fee=None, actual_fee=total_fee, refund_fee=None)
        order_end = create_time + time_length * 1000
        pay_time, order_end, create_time = map(
            lambda x: datetime.fromtimestamp(int(x / 1000)), [pay_time, order_end, create_time]
        )
        extra_dict = dict()
        for key in shop_order:
            if key not in keys and key not in extra_keys and key not in ["mall_id", "mall_name"]:
                extra_dict[key] = shop_order[key]

        time_dict = dict(order_start=pay_time, order_end=order_end, order_create_time=create_time, order_pay_time=pay_time)
        shop_order_db.save_shop_order(
            order_id, order_type, article_code, item_name, item_code, activity_code, fee_dict, time_dict, extra_dict
        )


if __name__ == "__main__":
    end_time = int(math.floor(time.time()))
    start_time = end_time - 24 * 60 * 60
    start_time, end_time = map(lambda x: x * 1000, [start_time, end_time])
    process_main(start_time, end_time)
