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


def handler_invalid_code(request):
    keys = ["error", "error_description"]
    error, error_desc = [unquote(request.GET.get(key, "")) for key in keys]
    if error == "invalid_client" and "need purchase" in error_desc:
        error_msg = "need purchase"
    elif error == "access_denied" and error_desc == "parent account forbid this sub account to access app.":
        error_msg = "access_denied_forbid"
    elif error == "access_denied" and error_desc == "parent account should authorize in web way first.":
        error_msg = "access_denied_authorize"
    else:
        error_msg = "handler error:{0} error_desc:{1}".format(error, error_desc)
    return render(request, "auth_error.html", {"error_msg": error_msg})


def save_oauth_user_info(user):
    keys = ["nick", "platform", "softname"]
    nick, platform, softname = [user.oauth_info[key] for key in keys]
    shop_service = ShopService(nick, platform, softname)
    keys = ["uid", "sub_nick", "access_token", "refresh_token", "access_expires", "refresh_expires"]
    uid, sub_nick, access_token, refresh_token, access_expires, refresh_expires = [user.oauth_info[key] for key in keys]
    shop_service.save_shop_info(uid, sub_nick, access_token, refresh_token, access_expires, refresh_expires)


@ensure_csrf_cookie
def debug_login(request):
    if request.method != "GET":
        raise Http404("debug授权失败, 请求必须为GET.")
    keys = ["username", "platform"]
    username, platform = [request.GET.get(key, "") for key in keys]
    if not (username and platform):
        raise Http404("debug授权失败, 参数错误.")
    first_name = username + "|" + platform
    users = User.objects.filter(first_name=first_name)
    if not users:
        raise Http404("debug授权失败, 用户不存在")
    user = users[0]
    login(request, user, "auth.backends.ZnzAuthBackend")
    return HttpResponseRedirect(reverse("index"))


@ensure_csrf_cookie
def taobao_login(request):
    if request.method != "GET":
        raise Http404("淘宝授权失败, 请求必须为GET")
    code = request.GET.get("code", "")
    if not code:
        handler_invalid_code(request)
    user = authenticate(token=code, platform="taobao", softname="znz")
    save_oauth_user_info(user)
    login(request, user)
    request.session.set_expiry(7 * 24 * 3600)
    return HttpResponseRedirect(reverse("index"))
