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
from compass_warp.view.copy import view as copy_view

from compass_warp.view.main import ajax_view as main_ajax_view
from compass_warp.view.copy import ajax_view as copy_ajax_view

handler404 = main_view.handler404
urlpatterns = [
    path("auth/pinduoduo_login", auth_view.pinduoduo_login),
    path("sxdz_auth_pdd", auth_view.pinduoduo_login),
    path("auth/debug_login", auth_view.debug_login),
    path("link_copy", copy_view.link_copy, name="link_copy"),
]

ajax_main_urlpatterns = [
    path("ajax_get_shop_info", main_ajax_view.ajax_get_shop_info),
]

ajax_copy_urlPatterns = [
    path("ajax_create_copy_task", copy_ajax_view.ajax_create_copy_task),
    path("ajax_hide_copy_complex_tasks", copy_ajax_view.ajax_hide_copy_complex_tasks),
    path("ajax_get_copy_complex_tasks", copy_ajax_view.ajax_get_copy_complex_tasks),
    path("ajax_get_logistic_templates", copy_ajax_view.ajax_get_logistic_templates),
]

urlpatterns += ajax_main_urlpatterns
urlpatterns += ajax_copy_urlPatterns

# check
