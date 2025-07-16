#!/usr/bin/env python3
"""Generate the production `.env` file.

Run this script before starting Docker or the Dev Container to create
`.env` based on the example file shipped with this repository.
"""
import argparse
import secrets
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

EXAMPLES = {
    'prod': BASE_DIR / '.env.example',
}
TARGETS = {
    'prod': BASE_DIR / '.env',
}

PLACEHOLDERS = {
    'DJANGO_SECRET_KEY': '<long-secret-key>',
    'POSTGRES_PASSWORD': '<long-secret-password>',
    'DJANGO_SUPERUSER_PASSWORD': '<long-secret-password>',
    'HIBP_API_KEY': '<dummy-hibp-key>',
    'DEVCONTAINER_NGROK_AUTHTOKEN': '<long-ngrok-token>',
}


def _fill_value(key: str, value: str) -> str:
    """Return a suitable default for the given key if the value is empty or a placeholder."""
    if not value or value == PLACEHOLDERS.get(key) or (
        key == 'DJANGO_SECRET_KEY' and value == 'change-this-to-a-random-secret-key'
    ):
        if key == 'DJANGO_SECRET_KEY':
            return secrets.token_urlsafe(50)
        if key in {'POSTGRES_PASSWORD', 'DJANGO_SUPERUSER_PASSWORD'}:
            return secrets.token_urlsafe(16)
        if key == 'DJANGO_SUPERUSER_USERNAME':
            return 'admin'
        return ''
    return value

def generate(env: str) -> Path:
    example_path = EXAMPLES[env]
    target_path = TARGETS[env]
    lines = []
    for raw in example_path.read_text().splitlines():
        line = raw.strip('\n')
        if not line or line.startswith('#'):
            lines.append(line)
            continue
        key, _, value = line.partition('=')
        value = _fill_value(key, value)
        lines.append(f"{key}={value}")
    target_path.write_text('\n'.join(lines) + '\n')
    return target_path


def main() -> None:
    parser = argparse.ArgumentParser(description='Generate the .env file.')
    args = parser.parse_args()

    path = generate('prod')
    print(f"Created {path}")

if __name__ == '__main__':
    main()
