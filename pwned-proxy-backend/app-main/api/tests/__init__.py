"""Test helpers for the API package."""

import django
from django.conf import settings

# Ensure Django is configured when running the tests directly with pytest.
if not settings.configured:
    import os
    import sys
    from pathlib import Path

    # Ensure the project root (containing ``app-main``) is on ``sys.path``
    ROOT_DIR = Path(__file__).resolve().parents[3]
    APP_MAIN = ROOT_DIR / "app-main"

    # Add both the project root and ``app-main`` to ``sys.path`` so imports
    # like ``envutils`` and the ``pwned_proxy`` package work during tests.
    sys.path.insert(0, str(ROOT_DIR))
    sys.path.insert(0, str(APP_MAIN))

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pwned_proxy.settings")
    django.setup()

from .test_urls import *  # noqa
