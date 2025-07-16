#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path

# The working directory may be ``app-main`` when running inside Docker.
# Ensure both the project root and ``app-main`` are on ``sys.path`` so
# that ``pwned_proxy.settings`` can import ``envutils`` regardless of
# where this script is executed.
BASE_DIR = Path(__file__).resolve().parent

# Add both directories to ``sys.path`` so Django can locate the project
# packages when invoked from the host or the container environment.
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
