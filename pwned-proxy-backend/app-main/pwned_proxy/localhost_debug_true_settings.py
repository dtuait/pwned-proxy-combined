from .WARNING_import_settings_with_DEBUG_enabled import *
DEBUG = True

# CSRF_COOKIE_DOMAIN = 'vicre-nextjs-app01.ngrok.app'
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000'
]



# If you’re debugging over HTTPS but not forcing cookies to be Secure:
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# These can remain off in dev:
SECURE_SSL_REDIRECT = False
SECURE_HSTS_SECONDS = 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False

CORS_ALLOW_ALL_ORIGINS = True
# CORS_ALLOWED_ORIGINS = ['https://vicre-nextjs-app01.ngrok.app']
