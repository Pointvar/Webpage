from django.contrib.auth.models import User
from compass_warp.auth.oauth import OauthService

import time
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class OAuthBackend:
    def authenticate(self, request, token=None, platform=None, soft_code=None):
        # username->sid email->platform,soft_code first_name->nick
        # sid 为字符串
        oauth2 = OauthService(token, platform, soft_code)
        logger.info("[auth_backend] token:{0} platform:{1}".format(token, platform))
        oauth_info = oauth2.fetch_pinduoduo_oauth_info()
        keys = ["owner_id", "owner_name", "access_token", "refresh_token", "expires_at", "refresh_token_expires_at"]
        sid, nick, access_token, refresh_token, access_expires, refresh_expires = [oauth_info[key] for key in keys]
        access_expires = str(datetime.fromtimestamp(access_expires)).split(".")[0]
        access_expires = str(datetime.fromtimestamp(refresh_expires)).split(".")[0]
        process_oauth = dict(
            sid=sid,
            nick=nick,
            platform=platform,
            soft_code=soft_code,
            access_token=access_token,
            refresh_token=refresh_token,
            access_expires=access_expires,
            refresh_expires=refresh_expires,
        )
        email = "^|$".join([platform, soft_code])
        # 保存或更新用户信息
        try:
            user = User.objects.get(username=sid, email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(sid, email)
            user.date_joined = str(datetime.now()).split(".")[0]
        user.first_name = nick
        user.last_login = str(datetime.now()).split(".")[0]
        user.save()
        user.process_oauth = process_oauth
        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
