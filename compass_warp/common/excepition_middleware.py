import logging
from django.http import response
from django.http.response import JsonResponse
from compass_warp.common.exceptions import *

logger = logging.getLogger(__name__)


class ExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.DEFAULT_ERROR = "后端接口调用错误，请联系客服处理。"

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if not request.is_ajax():
            return None
        logger_str = "EXCEPTION_NICK:%s\nPATH:%s\nPOST:%s\nBODY%s\nGET:%s\nUSER_AGENT:%s\nHTTP_REFERER:%s\n" % (
            request.shop_info["nick"],
            request.path,
            request.POST,
            request.body,
            request.GET,
            request.META["HTTP_USER_AGENT"],
            request.META.get("HTTP_REFERER", ""),
        )
        ret_data = {"success": False, "data": {"code": 0, "msg": self.DEFAULT_ERROR}}
        if isinstance(exception, InvalidInputException):
            ret_data["data"]["code"] = 100
            ret_data["data"]["msg"] = exception.msg
            logger.exception(logger_str)
        else:
            logger_str = "UNPROCESS_ERROR-" + logger_str
            logger.exception(logger_str)
        return JsonResponse(ret_data)
