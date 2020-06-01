from django.shortcuts import render
import logging


def handler404(request, exception=""):
    return render(request, "404.html", {"except_msg": str(exception)})


def demo(request):
    return render(request, "demo.html")
