from django.http import JsonResponse
from datetime import datetime
from compass_warp.common.decorator import ajax_json_validate
from compass_warp.view.copy.ajax_schema import *


@ajax_json_validate(ajax_create_copy_task_schema)
def ajax_create_copy_task(request):
    return_dict = {"success": True, "data": ""}
    # shop_info = request.shop_info
    now = datetime.now()
    shop_info = dict(nick="pdd123456", deadline=str(now).split(" ")[0])
    return_dict["data"] = shop_info
    return JsonResponse(return_dict)
