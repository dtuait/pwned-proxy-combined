"""
WSGI config for pwned_proxy project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
import sys
from pathlib import Path

# When executed inside Docker the working directory is ``app-main``.
# Include the repository root on ``sys.path`` so that ``envutils`` can be
# imported by ``pwned_proxy.settings``.
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pwned_proxy.settings')

application = get_wsgi_application()
