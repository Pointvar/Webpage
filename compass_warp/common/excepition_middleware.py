import logging
from django.http import response
from django.http.response import JsonResponse
from compass_warp.compass.settings import OAUTH_CONF_PDD
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
        ret_data = {"success": False, "data": {"code": 1000, "msg": self.DEFAULT_ERROR}}
        if isinstance(exception, InvalidInputException):
            # ajax传入数据校验错误
            ret_data["data"]["code"] = 1001
            ret_data["data"]["msg"] = exception.msg
            logger.exception(logger_str)
        elif isinstance(exception, TokenExpireException):
            ret_data["data"]["code"] = 3000
            ret_data["data"]["msg"] = "三方授权已失效, API暂时不可调用。"
            ret_data["data"]["process"] = OAUTH_CONF_PDD
        else:
            logger_str = "UNPROCESS_ERROR-" + logger_str
        logger.exception(logger_str)
        return JsonResponse(ret_data)
