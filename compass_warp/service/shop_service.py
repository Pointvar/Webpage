from db_models.shop_infos.shop_auth_db import ShopAuthDB


class ShopService:
    def __init__(self, sid, nick, platform, soft_code):
        self.sid = sid
        self.nick = nick
        self.platform = platform
        self.soft_code = soft_code
        self.shop_auth_db = ShopAuthDB(sid, nick, platform, soft_code)

    def save_shop_auth(self, access_token, refresh_token, access_expires, refresh_expires):
        self.shop_auth_db.save_shop_auth(access_token, refresh_token, access_expires, refresh_expires)

    # def get_shop_auths(self):
    #     shop_infos = self.shop_auth_db.get_shop_info_by_nick()
    #     return shop_infos
