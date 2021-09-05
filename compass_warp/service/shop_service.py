if __name__ == "__main__":
    import os, sys

    dir_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../Webpage"))
    sys.path.append(dir_path)
    from compass_warp.compass_conf.set_env import set_path_env

    set_path_env()
from db_models.shop_infos.shop_auth_db import ShopAuthDB
from db_models.shop_infos.shop_info_db import ShopInfoDB

from pdd_models.get_pdd_mall_info import GetPddMallInfo


class ShopService:
    def __init__(self, sid, nick, platform, soft_code, source):
        self.sid = sid
        self.nick = nick
        self.platform = platform
        self.soft_code = soft_code
        self.source = source
        self.user_info = dict(sid=sid, nick=nick, platform=platform, soft_code=soft_code)
        self.shop_auth_db = ShopAuthDB(sid, nick, platform, soft_code)
        self.shop_info_db = ShopInfoDB(sid, nick, platform, soft_code)
        self.pdd_get_shop_info_api = GetPddMallInfo(self.user_info, self.source)

    def save_shop_auth(self, access_token, refresh_token, access_expires, refresh_expires):
        self.shop_auth_db.save_shop_auth(access_token, refresh_token, access_expires, refresh_expires)

    def save_shop_info(self):
        shop_info = self.pdd_get_shop_info_api.get_pdd_mall_info()
        keys = ["logo", "mall_name", "merchant_type", "mall_character"]
        shop_logo, shop_name, shop_type, shop_station = [shop_info[key] for key in keys]
        self.shop_info_db.save_shop_info(shop_logo, shop_name, shop_type, shop_station)

    def get_shop_info(self):
        shop_info = self.shop_info_db.get_shop_info()
        return shop_info


if __name__ == "__main__":
    sid, nick, platform, soft_code, source = "888530519", "", "pinduoduo", "kjsh", "test"
    shop_service = ShopService(sid, nick, platform, soft_code, source)
    print(shop_service.pdd_get_shop_info_api.get_pdd_mall_info())
