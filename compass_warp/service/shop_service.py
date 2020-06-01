# from compass_warp.db_models.comm_info.shop_info_db import ShopInfoDB
# from shop_infos.shop_auth_db import ShopAuthDB


# class ShopService:
#     def __init__(self, sid, nick, platform, softname):
#         self.sid = sid
#         self.nick = nick
#         self.platform = platform
#         self.softname = softname
#         self.shop_auth_db = ShopAuthDB(sid, nick, platform, soft_name)

#     def save_shop_auth(self, uid, sub_nick, access_token, refresh_token, access_expires, refresh_expires):
#         self.shop_auth_db.insert_shop_auth(uid, sub_nick, access_token, refresh_token, access_expires, refresh_expires)

#     def get_shop_auths(self):
#         shop_infos = self.shop_auth_db.get_shop_info_by_nick()
#         return shop_infos


class ShopService:
    def __init__(self):
        pass
