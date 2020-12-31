import requests
from urllib import parse
from compass_warp.compass.settings import APP_CONF_TB, OAUTH_CONF_TB, OAUTH_REDIRECT


class OauthService:
    def __init__(self, token, platform):
        self.token = token
        self.platform = platform

    def fetch_access_token(self):
        token, platform = self.token, self.platform
        keys = ["APP_KEY", "APP_SECRET"]
        client_id, client_secret = [APP_CONF_TB[key] for key in keys]
        redirect_url = OAUTH_REDIRECT["taobao"]
        token_url = OAUTH_CONF_TB["token_url"]

        params = dict(
            code=token,
            grant_type="authorization_code",
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_url,
        )
        resp = requests.post(token_url, data=params)
        access_info = resp.json()
        if "taobao_user_id" not in access_info:
            raise AppCatchException("淘宝授权失败")
        return access_info

    def fetch_oauth_info(self, access_info):
        keys = [
            "taobao_user_id",
            "taobao_user_nick",
            "sub_taobao_user_nick",
            "access_token",
            "refresh_token",
            "expires_in",
            "re_expires_in",
        ]
        (uid, nick, sub_nick, access_token, refresh_token, access_expires, refresh_expires) = [
            access_info[key] for key in keys
        ]
        nick = parse.unquote(nick)
        sub_nick = parse.unquote(sub_nick)

        oauth_info = dict(
            uid=uid,
            nick=nick,
            sub_nick=sub_nick,
            access_token=access_token,
            refresh_token=refresh_token,
            access_expires=access_expires,
            refresh_expires=refresh_expires,
        )
        return oauth_info


if __name__ == "__main__":
    auth_obj = OauthService("", "taobao")
    auth_obj.fetch_access_token()
