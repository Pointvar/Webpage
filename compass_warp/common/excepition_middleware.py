import logging
from django.http import response
from django.http.response import JsonResponse
from compass_warp.common.exceptions import *
from pdd_models.common.exceptions import TokenExpireException

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
            # ajax传入数据校验错误
            ret_data["data"]["code"] = 100
            ret_data["data"]["msg"] = exception.msg
            logger.exception(logger_str)
        elif isinstance(exception, TokenExpireException):
            # 拼多多授权失效 可能2种情况，订单到期或授权失效。
            ret_data["data"]["code"] = 200
            ret_data["data"]["msg"] = "授权已失效"
        else:
            logger_str = "UNPROCESS_ERROR-" + logger_str
            logger.exception(logger_str)
        return JsonResponse(ret_data)
