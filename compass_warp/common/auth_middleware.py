from django.contrib.auth.models import AnonymousUser
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.core.urlresolvers import reverse


import logging

logger = logging.getLogger(__name__)


class AuthMiddleware(object):
    def process_request(self, request):
        if not request.is_ajax():
            return None
        if isinstance(request.user, AnonymousUser):
            return None

        nick = request.user.first_name
        username = request.user.username
        if username.startswith("1000-"):
            shop_info = {
                "sid": username.split("-")[-1],
                "nick": nick,
                "soft_code": "kjsh",
                "platform": "pinduoduo",
                "first_come": request.user.date_joined,
            }
        request.shop_info = shop_info
        return None
