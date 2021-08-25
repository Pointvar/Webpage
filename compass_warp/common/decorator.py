import json
import logging
from jsonschema import validate
from django.http import JsonResponse
from compass_warp.common.exceptions import InvalidInputException
from jsonschema.exceptions import SchemaError, ValidationError

logger = logging.getLogger(__name__)


def ajax_json_validate(schema):
    def wrapped(func):
        def wrapper(request, *args, **kwargs):
            if not request.is_ajax():
                return JsonResponse({"success": False, "data": "the request should be a ajax call"})

            try:
                data = json.loads(request.body)
                validate(instance=data, schema=schema)
            except (SchemaError, ValidationError) as e:
                raise InvalidInputException(str(e))
            request.json = data
            response = func(request, *args, **kwargs)
            body, content = str(request.body), str(response.content)

            body = "TOO LONG" if len(body) > 8000 else body
            content = "TOO LONG" if len(content) > 8000 else content
            shop_info = request.shop_info if hasattr(request, "shop_info") else {}
            logger.info(
                "<func>: AjaxRequest, <ajax>: %s, <refer>: %s, <shop_info>: %s, <body>: %s, <content>: %s"
                % (request.path, request.META.get("HTTP_REFERER", ""), shop_info, body, content)
            )
            return response

        return wrapper

    return wrapped
