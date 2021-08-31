import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "../../"))

from compass_warp.compass_conf.set_env import set_path_env

set_path_env()

from datetime import datetime
from sys import platform
from db_models.shop_infos.shop_order_db import ShopOrderDB


class VersionService:
    def __init__(self, sid, nick, platform, soft_code):
        self.sid = sid
        self.nick = nick
        self.platform = platform
        self.soft_code = soft_code
        self.shop_order_db = ShopOrderDB(sid, nick, platform, soft_code)

    def get_shop_version_by_orders(self):
        time_now = datetime.now()
        # 全部订单
        all_shop_orders = self.shop_order_db.get_shop_orders()
        # 过滤有效订单
        shop_orders = [shop_order for shop_order in all_shop_orders if shop_order["order_end"] >= time_now]
        shop_orders = sorted(shop_orders, key=lambda x: x["order_start"])
        versions, deadlines = [], []
        version_codes = {"试用版": "0", "基础班": "1", "高级版": "2", "旗舰版": "3"}
        code_versions = {value: key for (key, value) in version_codes.items()}
        for shop_order in shop_orders:
            keys = ["item_name", "order_end"]
            item_name, order_end = [shop_order[key] for key in keys]
            version = version_codes[item_name.split(",")[0].split(":")[-1]]
            versions.append(version)
            deadlines.append(order_end)
        if shop_orders:
            version = code_versions[str(max(map(int, versions)))]
            deadline = str(max(deadlines)).split(" ")[0]
        else:
            version = all_shop_orders[-1]["item_name"].split(",")[0].split(":")[-1]
            deadline = all_shop_orders[-1]["order_end"]
        return version, deadline


if __name__ == "__main__":
    user_info = {"sid": "168780345", "nick": "pdd88853051977", "soft_code": "kjsh", "platform": "pinduoduo"}
    sid, nick, soft_code, platform = [user_info[key] for key in ["sid", "nick", "soft_code", "platform"]]
    VersionService(sid, nick, platform, soft_code).get_shop_version_by_orders()
