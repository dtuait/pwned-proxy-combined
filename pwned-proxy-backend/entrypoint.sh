#!/bin/sh
set -e

# Validate environment before starting
/usr/src/venvs/app-main/bin/python /usr/src/project/check_env.py


# Ensure we can write to the STATIC_ROOT directory even if a
# stale container image left it owned by root. This mirrors the
# permissions set during image build and allows "docker compose up"
# without a rebuild to succeed.
STATIC_ROOT=/usr/src/project/app-main/staticfiles
sudo install -d -m 0755 "$STATIC_ROOT" && sudo chown appuser:appuser "$STATIC_ROOT"

/usr/src/venvs/app-main/bin/python app-main/wait_for_db.py

/usr/src/venvs/app-main/bin/python manage.py migrate --noinput
/usr/src/venvs/app-main/bin/python manage.py collectstatic --noinput
/usr/src/venvs/app-main/bin/python app-main/create_admin.py
# Run one-time setup tasks if HIBP_API_KEY is configured
/usr/src/venvs/app-main/bin/python manage.py initial_setup || true

exec /usr/src/venvs/app-main/bin/gunicorn \
    pwned_proxy.wsgi:application \
    --bind 0.0.0.0:8000 \
    --access-logfile - \
    --log-level info

