#!/bin/sh
# Wrapper to generate environment files for this project.
# Run before starting Docker or the dev container.

DIR="$(dirname "$0")"
python3 "$DIR/generate_env.py" "$@"
