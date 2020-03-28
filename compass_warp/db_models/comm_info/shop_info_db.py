import hashlib
from datetime import datetime
from compass_warp.db_models.conf.settings import MongoConn


class ShopInfoDB:
    db_name = "CommomInfo"
    table_name = "shop_info"
    shop_info = MongoConn[db_name][table_name]

    def __init__(self, nick, platform, softname):
        self.nick = nick
        self.platform = platform
        self.softname = softname

    def save_shop_info(self, uid, sub_nick, access_token, refresh_token, access_expires, refresh_expires):
        nick, platform, softname = self.nick, self.platform, self.softname
        access_expires = datetime.strptime(access_expires, "%Y-%m-%d %H:%M:%S")
        refresh_expires = datetime.strptime(refresh_expires, "%Y-%m-%d %H:%M:%S")
        time_now = datetime.now()
        in_id = hashlib.sha1((nick + sub_nick + platform + softname).encode("utf-8")).hexdigest()
        shop_info = dict(
            _id=in_id,
            uid=uid,
            nick=nick,
            platform=platform,
            softname=softname,
            sub_nick=sub_nick,
            access_token=access_token,
            refresh_token=refresh_token,
            access_expires=access_expires,
            refresh_expires=refresh_expires,
        )
        shop_info.update(c_time=time_now, m_time=time_now, valid=True)
        ShopInfoDB.shop_info.save(shop_info)

    def get_shop_info_by_nick(self):
        find_params = dict(nick=self.nick, platform=self.platform, softname=self.softname)
        rows = ShopInfoDB.shop_info.find(find_params)
        return list(rows)
