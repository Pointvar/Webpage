from shop_infos.shop_order_db import ShopAuthDB


class VersionService:
    def __init__(self, sid, nick, platform, soft_name):
        self.sid = sid
        self.nick = nick
        self.platform = platform
        self.soft_name = soft_name
        self.shop_auth_db = ShopOrderDB(sid, nick, platform, soft_name)

    def save_shop_auth(self, access_token, refresh_token, access_expires, refresh_expires):
        self.shop_auth_db.save_shop_auth(access_token, refresh_token, access_expires, refresh_expires)

        # def get_shop_auths(self):
        #     shop_infos = self.shop_auth_db.get_shop_info_by_nick()
        #     return shop_infos
