"""Test helpers for the API package."""

import django
from django.conf import settings

# Ensure Django is configured when running the tests directly with pytest.
if not settings.configured:
    import os
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pwned_proxy.settings")
    django.setup()

from .test_urls import *  # noqa
