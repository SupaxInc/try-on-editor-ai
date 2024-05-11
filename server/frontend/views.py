from django.shortcuts import render

def index(request):
    """Serve the frontend React app."""
    return render(request, 'index.html')