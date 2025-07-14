#!/usr/bin/env python3
"""Generate environment files for production and the dev container.

Run this script before starting Docker or the Dev Container to create
`.env` and `.devcontainer/.env` based on the example files shipped with
this repository.
"""
import argparse
import secrets
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

EXAMPLES = {
    'prod': BASE_DIR / '.env.prod.example',
    'devcontainer': BASE_DIR / '.env.dev.example',
}
TARGETS = {
    'prod': BASE_DIR / '.env',
    'devcontainer': BASE_DIR / '.devcontainer' / '.env',
}

def _fill_value(key: str) -> str:
    """Return a suitable default for the given key."""
    if key == 'DJANGO_SECRET_KEY':
        return secrets.token_urlsafe(50)
    if key in {'POSTGRES_PASSWORD', 'DJANGO_SUPERUSER_PASSWORD'}:
        return secrets.token_urlsafe(16)
    if key == 'DJANGO_SUPERUSER_USERNAME':
        return 'admin'
    return ''

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
        if not value:
            value = _fill_value(key)
        lines.append(f"{key}={value}")
    target_path.write_text('\n'.join(lines) + '\n')
    return target_path


def main() -> None:
    parser = argparse.ArgumentParser(description='Generate .env files.')
    parser.add_argument(
        'target',
        nargs='?',
        choices=['prod', 'devcontainer', 'all'],
        default='all',
        help='Which environment file to generate',
    )
    args = parser.parse_args()

    envs = ['prod', 'devcontainer'] if args.target == 'all' else [args.target]
    for env in envs:
        path = generate(env)
        print(f"Created {path}")

if __name__ == '__main__':
    main()
