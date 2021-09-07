from django.shortcuts import render
import logging


def link_copy(request):
    return render(request, "link_copy.html")


def copy_record(request):
    return render(request, "copy_record.html")
