from django.http import JsonResponse

from django.contrib.auth.decorators import login_required
from compass_warp.common.decorator import ajax_json_validate
from compass_warp.service.copy_service import CopyService
from compass_warp.view.copy.ajax_schema import *


@login_required
@ajax_json_validate(ajax_create_copy_task_schema)
def ajax_create_copy_task(request):
    return_dict = {"success": True, "data": ""}
    shop_info = request.shop_info
    keys = ["sid", "nick", "platform", "soft_code", "source"]
    sid, nick, platform, soft_code, source = [shop_info[key] for key in keys]
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    keys = ["copy_urls", "item_set", "price_set", "advanced_set"]
    copy_urls, item_set, price_set, advanced_set = [request.json[key] for key in keys]
    copy_urls, filter_urls, invalid_urls, valid_urls = copy_service.save_copy_task(copy_urls, item_set, price_set, advanced_set)
    return_dict["data"] = dict(copy_urls=copy_urls, filter_urls=filter_urls, invalid_urls=invalid_urls, valid_urls=valid_urls)
    return JsonResponse(return_dict)


@login_required
@ajax_json_validate(ajax_get_logistic_templates_schema)
def ajax_get_logistic_templates(request):
    return_dict = {"success": True, "data": ""}
    shop_info = request.shop_info
    keys = ["sid", "nick", "platform", "soft_code", "source"]
    sid, nick, platform, soft_code, source = [shop_info[key] for key in keys]
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    logistic_templates = copy_service.get_logistic_templates()
    return_dict["data"] = logistic_templates
    return JsonResponse(return_dict)


@login_required
@ajax_json_validate(ajax_get_authorize_cats_schema)
def ajax_get_authorize_cats(request):
    return_dict = {"success": True, "data": ""}
    shop_info = request.shop_info
    keys = ["sid", "nick", "platform", "soft_code", "source"]
    sid, nick, platform, soft_code, source = [shop_info[key] for key in keys]
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    authorize_cats = copy_service.get_authorize_cats()
    return_dict["data"] = authorize_cats
    return JsonResponse(return_dict)


@login_required
@ajax_json_validate(ajax_get_copy_complex_tasks_schema)
def ajax_get_copy_complex_tasks(request):
    return_dict = {"success": True, "data": ""}
    shop_info = request.shop_info
    keys = ["sid", "nick", "platform", "soft_code", "source"]
    sid, nick, platform, soft_code, source = [shop_info[key] for key in keys]
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    complex_tasks = copy_service.get_show_complex_tasks()
    return_dict["data"] = complex_tasks
    return JsonResponse(return_dict)


@login_required
@ajax_json_validate(ajax_hide_copy_complex_tasks_schema)
def ajax_hide_copy_complex_tasks(request):
    return_dict = {"success": True, "data": ""}
    shop_info = request.shop_info
    keys = ["sid", "nick", "platform", "soft_code", "source"]
    sid, nick, platform, soft_code, source = [shop_info[key] for key in keys]
    in_ids = request.json["in_ids"]
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    update_dict = dict(hide_status=True)
    copy_service.update_complex_task_by_params(in_ids, update_dict)
    complex_tasks = copy_service.get_show_complex_tasks()
    return_dict["data"] = complex_tasks
    return JsonResponse(return_dict)
