"""compass URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from compass_warp.auth import view as auth_view
from compass_warp.view.main import view as main_view
from compass_warp.view.main import ajax_view as main_ajax_view

handler404 = main_view.handler404
urlpatterns = [
    path('admin/', admin.site.urls),
    path('ajax_hello', main_ajax_view.ajax_hello, name="index"),
    path('taobao_login', auth_view.taobao_login),
    path('debug_login', auth_view.debug_login)
]
