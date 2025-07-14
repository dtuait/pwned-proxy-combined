#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path

# When this script is executed inside the Docker image the working
# directory is ``app-main`` which means modules located in the project
# root are not on ``sys.path``. Add the parent directory so that the
# ``envutils`` module can be imported by ``pwned_proxy.settings``.
sys.path.append(str(Path(__file__).resolve().parent.parent))


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
