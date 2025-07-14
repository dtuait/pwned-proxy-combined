# pwned_proxy/localhost_production_settings.py

from .settings import *  # First pull in all base settings

# Override only what's needed for production-like settings on localhost.

DEBUG = False
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# If you need CSRF or CORS set for local dev behind a domain or IP:
CSRF_TRUSTED_ORIGINS = [
    "http://localhost",
    "http://127.0.0.1",
    # Add more as needed...
]
CORS_ALLOW_ALL_ORIGINS = True

SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# If you are using HTTPS on localhost (with something like mkcert),
# set these to True (and set your local TLS). Otherwise keep them False for local dev:
SECURE_SSL_REDIRECT = False
SECURE_HSTS_SECONDS = 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
