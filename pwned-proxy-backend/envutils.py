from pathlib import Path
import os
import secrets
from dotenv import load_dotenv


def ensure_env(base_dir: Path) -> None:
    """Load environment variables from an existing `.env` or set defaults."""
    env_paths = [
        base_dir.parent / '.devcontainer' / '.env',
        base_dir.parent / '.env'
    ]
    for path in env_paths:
        if path.exists():
            load_dotenv(path)
            return

    env_path = base_dir.parent / '.env'

    defaults = {
        'DJANGO_SECRET_KEY': secrets.token_urlsafe(50),
        'DJANGO_SUPERUSER_USERNAME': f"admin_{secrets.token_hex(4)}",
        'DJANGO_SUPERUSER_PASSWORD': secrets.token_urlsafe(16),
        'DJANGO_DEBUG': 'false',
        # Provide database settings so `manage.py runserver` works without
        # running `generate_env.sh` first. These match the defaults used by
        # Docker Compose.
        'POSTGRES_DB': 'db',
        'POSTGRES_USER': 'postgres',
        'POSTGRES_PASSWORD': secrets.token_urlsafe(16),
    }

    with open(env_path, 'w') as fh:
        for key, value in defaults.items():
            fh.write(f"{key}={value}\n")
            os.environ.setdefault(key, value)

    print(f"Generated {env_path} with secure defaults:")
    for key, value in defaults.items():
        print(f"  {key}={value}")
    print("Admin credentials:")
    print(f"  username: {defaults['DJANGO_SUPERUSER_USERNAME']}")
    print(f"  password: {defaults['DJANGO_SUPERUSER_PASSWORD']}")

