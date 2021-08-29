from urllib.parse import unquote
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render

from compass_warp.service.shop_service import ShopService

import logging

logger = logging.getLogger(__name__)

# 工具函数
def save_oauth_user(user):
    """保存授权用户的店铺信息"""
    keys = ["sid", "nick", "platform", "soft_code"]
    sid, nick, platform, soft_code = [user.process_oauth[key] for key in keys]
    shop_service = ShopService(sid, nick, platform, soft_code)
    keys = ["access_token", "refresh_token", "access_expires", "refresh_expires"]
    access_token, refresh_token, access_expires, refresh_expires = [user.process_oauth[key] for key in keys]
    shop_service.save_shop_auth(access_token, refresh_token, access_expires, refresh_expires)


# 授权相关View
@ensure_csrf_cookie
def debug_login(request):
    """Debug授权登陆"""
    if request.method != "GET":
        raise Http404("Debug授权失败, 请求必须为GET。")
    keys = ["username", "platform"]
    username, platform = [request.GET.get(key, "") for key in keys]
    if not (username and platform):
        raise Http404("Debug授权失败, 参数错误。")
    first_name = username + "|" + platform
    users = User.objects.filter(first_name=first_name)
    if not users:
        raise Http404("Debug授权失败, 用户不存在。")
    user = users[0]
    login(request, user, "auth.backends.OAuthBackend")
    return HttpResponseRedirect(reverse("index"))


@ensure_csrf_cookie
def pinduoduo_login(request):
    """拼多多授权登陆"""
    if request.method != "GET":
        raise Http404("拼多多授权失败, 请求必须为GET。")
    code = request.GET.get("code", None)
    if not code:
        raise Http404("拼多多授权失败, 请求Code必须不能为空。")
    user = authenticate(token=code, platform="pinduoduo", soft_code="kjsh")
    save_oauth_user(user)
    login(request, user)
    request.session.set_expiry(31 * 24 * 3600)
    return HttpResponseRedirect(reverse("link_copy"))


# 退出相关View
def logout_page(request):
    """退出登陆状态"""
    logout(request)
    return HttpResponseRedirect(reverse("auth.views.login_page"))


# def login_page(request):
#     """登陆页面"""
#     logout(request)
#     return HttpResponseRedirect(reverse("auth.views.login_page"))
# def handler_taobao_invalid_code(request):
#     """淘宝登陆授权异常处理"""
#     keys = ["error", "error_description"]
#     error, error_desc = [unquote(request.GET.get(key, "")) for key in keys]
#     logger.debug("[auth] error:{} error_desc:{}", error, error_desc)
#     if error == "invalid_client" and "need purchase" in error_desc:
#         error_msg = "need purchase"
#     elif error == "access_denied" and "forbid this sub account to access app" in error_desc:
#         error_msg = "access_denied_forbid"
#     elif error == "access_denied" and "should authorize in web way first" in error_desc:
#         error_msg = "access_denied_authorize"
#     else:
#         logger.warn("[auth] catch unkonw warn error:{} error_desc:{}", error, error_desc)
#         error_msg = "handler error:{0} error_desc:{1}".format(error, error_desc)
#     return render(request, "auth_error.html", {"error_msg": error_msg})


# @ensure_csrf_cookie
# def taobao_login(request):
#     """淘宝授权登陆"""
#     if request.method != "GET":
#         raise Http404("淘宝授权失败, 请求必须为GET")
#     code = request.GET.get("code", "")
#     if not code:
#         response = handler_taobao_invalid_code(request)
#         return response
#     user = authenticate(token=code, platform="taobao", soft_code="znz")
#     save_oauth_user_info(user)
#     login(request, user)
#     request.session.set_expiry(7 * 24 * 3600)
#     return HttpResponseRedirect(reverse("index"))


# @ensure_csrf_cookie
# def zhanwai_login_by_phone(request):
#     """站外授权登陆"""
#     if request.method != "GET":
#         raise Http404("站外授权失败, 请求必须为GET")
#     auth_phone, auth_code = [request.GET.get(key) for key in ["auth_phone", "auth_code"]]
#     if auth_phone and auth_code:
#         code = "|".join([auth_phone, auth_code])
#         user = authenticate(token=code, platform="zhanwei_phone", soft_code="znz")
#         save_oauth_user_info(user)
#         login(request, user)
#         request.session.set_expiry(7 * 24 * 3600)
#         return HttpResponseRedirect(reverse("index"))
#     else:
#         logger.error("[auth] 站外授权失败, 请求参数丢失。 auth_phone:{0} auth_code:{1}".format(auth_phone, auth_code))
#         raise Http404("站外授权失败, 请求参数丢失。")
