from django.http import JsonResponse
from datetime import datetime
from compass_warp.common.decorator import ajax_json_validate
from compass_warp.service.copy_service import CopyService
from compass_warp.view.copy.ajax_schema import *


@ajax_json_validate(ajax_create_copy_task_schema)
def ajax_create_copy_task(request):
    return_dict = {"success": True, "data": ""}
    shop_info = request.shop_info
    keys = ["sid", "nick", "platform", "soft_code", "source"]
    sid, nick, platform, soft_code, source = [shop_info[key] for key in keys]
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    keys = ["copy_urls", "item_set", "price_set", "advanced_set"]
    copy_urls, item_set, price_set, advanced_set = [request.json[key] for key in keys]
    copy_service.save_copy_task(copy_urls, item_set, price_set, advanced_set)
    return JsonResponse(return_dict)


@ajax_json_validate(ajax_get_copy_complex_tasks_schema)
def ajax_get_copy_complex_tasks(request):
    return_dict = {"success": True, "data": ""}
    shop_info = request.shop_info
    keys = ["sid", "nick", "platform", "soft_code", "source"]
    sid, nick, platform, soft_code, source = [shop_info[key] for key in keys]
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    complex_tasks = copy_service.get_copy_complex_tasks()
    return_dict["data"] = complex_tasks
    return JsonResponse(return_dict)
