from django.http import JsonResponse
from datetime import datetime


from compass_warp.common.decorator import ajax_json_validate
from compass_warp.service.version_service import VersionService
from compass_warp.view.main.ajax_schema import *


@ajax_json_validate(ajax_get_shop_info_schema)
def ajax_get_shop_info(request):
    return_dict = {"success": True, "data": ""}
    shop_info = request.shop_info
    keys = ["sid", "nick", "platform", "soft_code"]
    sid, nick, platform, soft_code = [shop_info[key] for key in keys]
    version_service = VersionService(sid, nick, platform, soft_code)
    version, deadline = version_service.get_shop_version_by_orders()
    shop_info.update(version=version, deadline=deadline)
    return_dict["data"] = shop_info
    return JsonResponse(return_dict)
