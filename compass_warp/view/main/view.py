from django.http import HttpResponse
from datetime import datetime

def hello(request):
    now = datetime.now()
    html = "<html><body>It is now %s.</body></html>" % now
    return HttpResponse(html)
