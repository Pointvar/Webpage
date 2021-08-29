from pdd_models.create_pdd_pop_auth_token import CreatePddPopAuthToken


class OauthService:
    def __init__(self, token, platform, soft_code):
        self.token = token
        self.platform = platform
        self.soft_code = soft_code
        self.user_info = dict(sid=0, nick="", platform=platform, soft_code=soft_code)
        self.pdd_auth_token_api = CreatePddPopAuthToken(self.user_info, "web-oauth")

    def fetch_pinduoduo_oauth_info(self):
        oauth_info = self.pdd_auth_token_api.create_pdd_pop_auth_token(self.token)
        return oauth_info

    # def fetch_access_token(self):
    #     token, platform = self.token, self.platform
    #     keys = ["APP_KEY", "APP_SECRET"]
    #     client_id, client_secret = [APP_CONF_TB[key] for key in keys]
    #     redirect_url = OAUTH_REDIRECT["taobao"]
    #     token_url = OAUTH_CONF_TB["token_url"]

    #     params = dict(
    #         code=token,
    #         grant_type="authorization_code",
    #         client_id=client_id,
    #         client_secret=client_secret,
    #         redirect_uri=redirect_url,
    #     )
    #     resp = requests.post(token_url, data=params)
    #     access_info = resp.json()
    #     if "taobao_user_id" not in access_info:
    #         raise AppCatchException("淘宝授权失败")
    #     return access_info

    # def fetch_oauth_info(self, access_info):
    #     keys = [
    #         "taobao_user_id",
    #         "taobao_user_nick",
    #         "sub_taobao_user_nick",
    #         "access_token",
    #         "refresh_token",
    #         "expires_in",
    #         "re_expires_in",
    #     ]
    #     (uid, nick, sub_nick, access_token, refresh_token, access_expires, refresh_expires) = [access_info[key] for key in keys]
    #     nick = parse.unquote(nick)
    #     sub_nick = parse.unquote(sub_nick)

    #     oauth_info = dict(
    #         uid=uid,
    #         nick=nick,
    #         sub_nick=sub_nick,
    #         access_token=access_token,
    #         refresh_token=refresh_token,
    #         access_expires=access_expires,
    #         refresh_expires=refresh_expires,
    #     )
    #     return oauth_info


if __name__ == "__main__":
    auth_obj = OauthService("3381d99eab894f9b9263bcc33f7724fdc420b8bf", "pinduoduo")
    auth_obj.fetch_pinduoduo_access_token()
