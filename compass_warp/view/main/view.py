from django.http import HttpResponse
from datetime import datetime
import logging

def handler404(request, exception):
    html = "{except_msg}".format(except_msg=str(exception))
    return HttpResponse(html)
