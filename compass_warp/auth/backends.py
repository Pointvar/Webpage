from django.contrib.auth.models import User
from compass_warp.auth.oauth import OauthService

import time
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class ZnzAuthBackend:
    def authenticate(self, request, token=None, platform=None, softname=None):
        oauth_obj = OauthService(token, platform)
        logger.info("[auth_backend] token:{0} platform:{1}".format(token, platform))
        access_info = oauth_obj.fetch_access_token()
        oauth_info = oauth_obj.fetch_oauth_info(access_info)
        oauth_info.update(platform=platform, softname=softname)
        keys = ["uid", "nick", "sub_nick", "access_token", "refresh_token", "access_expires", "refresh_expires"]
        uid, nick, sub_nick, access_token, refresh_token, access_expires, refresh_expires = [oauth_info[key] for key in keys]
        username = "^|$".join([nick, platform, softname])
        password = "^|$".join([access_token, refresh_token])
        now_time = int(time.time())
        access_expires = str(datetime.fromtimestamp(now_time + access_expires)).split(".")[0]
        refresh_expires = str(datetime.fromtimestamp(now_time + refresh_expires)).split(".")[0]
        email = "^|$".join([access_expires, refresh_expires])
        # 保存或更新用户信息
        try:
            user = User.objects.get(username=username, last_name=sub_nick)
        except User.DoesNotExist:
            user = User.objects.create_user(username, email, password)
        user.password = password
        user.first_name = nick
        user.last_name = sub_nick
        user.email = email
        user.last_login = str(datetime.fromtimestamp(now_time)).split(".")[0]
        user.save()
        oauth_info.update(access_expires=access_expires, refresh_expires=refresh_expires)
        user.oauth_info = oauth_info
        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
