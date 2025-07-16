#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path

# When using Docker the working directory might not be the project root
# (e.g. ``app-main``). Include the parent directory on ``sys.path`` so
# that ``envutils`` can be imported by ``pwned_proxy.settings``.
BASE_DIR = Path(__file__).resolve().parent

# Ensure both the project root and ``app-main`` are on ``sys.path`` so that
# Django can locate the ``pwned_proxy`` package regardless of where the script
# is executed from. This mirrors the logic in ``app-main/manage.py`` which adds
# the parent directory when executed inside the container.
sys.path.append(str(BASE_DIR))
sys.path.append(str(BASE_DIR / "app-main"))


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pwned_proxy.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
