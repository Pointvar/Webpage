from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import logging


@login_required
def link_copy(request):
    return render(request, "link_copy.html")


@login_required
def copy_record(request):
    return render(request, "copy_record.html")
