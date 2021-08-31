from django.contrib.auth.models import AnonymousUser
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, Http404


import logging

logger = logging.getLogger(__name__)


class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.is_ajax():
            return self.get_response(request)
        if isinstance(request.user, AnonymousUser):
            return self.get_response(request)

        sid = request.user.username
        nick = request.user.first_name
        platform, soft_code = request.user.email.split("^|$")
        shop_info = {
            "sid": sid,
            "nick": nick,
            "soft_code": soft_code,
            "platform": platform,
            "source": "web-ajax{0}".format(request.path),
            "first_come": request.user.date_joined,
        }

        request.shop_info = shop_info
        return self.get_response(request)
