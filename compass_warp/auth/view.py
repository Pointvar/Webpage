from urllib.parse import unquote
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render


import logging
logger = logging.getLogger(__name__)


@ensure_csrf_cookie
def debug_login(request):
    if request.method != 'GET':
        raise Http404('debug授权失败, 请求必须为GET.')
    keys = ['username', 'platform']
    username, platform = [request.GET.get(key, '') for key in keys]
    if not (username and platform):
        raise Http404('debug授权失败, 参数错误.')
    first_name = username + '|' + platform
    users = User.objects.filter(first_name=username)
    if not users:
        raise Http404('debug授权失败, 用户不存在')
    user = users[0]
    login(request, user, 'auth.backends.ZnzAuthBackend')
    return HttpResponseRedirect(reverse('index'))

@ensure_csrf_cookie
def taobao_login(request):
    if request.method != 'GET':
        raise Http404('淘宝授权失败, 请求必须为GET')
    code = request.GET.get('code', '')
    if not code:
        keys = ['error', 'error_description']
        error, error_desc = [unquote(request.GET.get(key, '')) for key in keys]
        if error == 'invalid_client' and 'need purchase' in error_desc:
            error_msg = 'need purchase'
        elif error == 'access_denied' and error_desc == 'parent account forbid this sub account to access app.':
            error_msg = 'access_denied_forbid'
        elif error == 'access_denied' and error_desc == 'parent account should authorize in web way first.':
            error_msg = 'access_denied_authorize'
        else:
            error_msg = 'handler error:{0} error_desc:{1}'.format(error, error_desc)
        return render(request, 'auth_error.html')
    user = authenticate(code=code)
    
