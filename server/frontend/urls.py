# /server/frontend/urls.py

from django.urls import path
from .views import index

urlpatterns = [
    path('', index, name='index'),  # Root URL to serve the React app
]
