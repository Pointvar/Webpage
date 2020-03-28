from compass_warp.db_models.comm_info.shop_info_db import ShopInfoDB


class ShopService:
    def __init__(self, nick, platform, softname):
        self.nick = nick
        self.platform = platform
        self.softname = softname
        self.shop_info_db = ShopInfoDB(nick, platform, softname)

    def save_shop_info(self, uid, sub_nick, access_token, refresh_token, access_expires, refresh_expires):
        self.shop_info_db.save_shop_info(uid, sub_nick, access_token, refresh_token, access_expires, refresh_expires)

    def get_shop_infos(self):
        shop_infos = self.shop_info_db.get_shop_info_by_nick()
        return shop_infos
