from django.http import JsonResponse
from datetime import datetime


def ajax_get_shop_info(request):
    return_dict = {"success": True, "data": ""}
    now = datetime.now()
    shop_info = dict(nick="pdd123456", deadline=now)
    return_dict["data"] = shop_info
    return JsonResponse(return_dict)
