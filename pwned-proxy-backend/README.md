# Pwned Proxy Quickstart

This project ships with a Docker Compose setup that handles running the
Django application and a PostgreSQL database. On startup it will apply
all migrations and create a superuser automatically so you can log in
immediately.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed


Before starting the stack you must create a `.env` file. The `generate_env.sh`
helper will create it for you and automatically generate secure defaults for
`DJANGO_SECRET_KEY` and `POSTGRES_PASSWORD`:

```bash
./generate_env.sh
```

This populates `.env` using the provided `.env.example` template and should be
run before starting Docker or the Dev Container. Edit the created file and
replace any remaining placeholders as needed.

Set `DJANGO_DEBUG=true` in your `.env` to enable Django's debug mode.


## Running the stack

Build and start the containers:

```bash
docker compose up --build
```

The Django application will be available on port **8000**. It accepts
requests for `localhost`, `api.dtuaitsoc.ngrok.dev` and the domain set via
`PWNED_PROXY_DOMAIN` (defaulting to `api.haveibeenpwned.security.ait.dtu.dk`).
On first start, migrations are applied and a
superuser is created automatically. If the `.env` file was generated, all
generated values including the admin credentials are printed and stored in that
file so you can reuse them across restarts.

When deploying with `docker-compose-coolify.yaml`, ports `80` and `443` are
mapped to the internal port `8000` so the application is reachable at the
provided domain without specifying a port.

### Using a custom domain

When deploying on platforms like Coolify you may receive a unique domain via
the `SERVICE_FQDN_APP` environment variable. You can also supply additional
hosts through `DJANGO_ALLOWED_HOSTS`. These values are automatically appended to
the Django `ALLOWED_HOSTS` list so the application will accept requests for your
custom domain. The base domain used by Traefik and Django can be configured via
`PWNED_PROXY_DOMAIN`.

You can then log into the admin interface at
`http://localhost:8000/admin/` (or via your ngrok domain) using the
superuser credentials you provided.

### First-time setup

1. After logging into the Django admin, add your [Have I Been Pwned](https://haveibeenpwned.com/api) API key:
   - Navigate to **HIBP Keys** and create a new key with the value you received from HIBP.
2. Go to **Domains** and click **Import from HIBP**. This populates the database with the latest domain data.
3. Open **Groups** and use the **Seed Groups** action to generate API keys for each predefined group. The keys are downloaded as a JSON file.
4. Finally, visit `http://localhost:8000/` to open the Swagger start page and try out the API using the generated keys.

## Running tests

Unit tests verify that each endpoint respects API key permissions. The test suite
uses the JSON produced by the **Seed Groups** admin action. A copy of this file
is located at `app-main/api/tests/seeded_api_keys.json`.

Execute the tests with:

```bash
# Install dependencies if running outside Docker
pip install -r requirements.txt

PYTHONPATH=app-main DJANGO_SETTINGS_MODULE=pwned_proxy.settings \
python manage.py test api
```

## Running integration tests with Docker Compose

Integration tests can be executed inside the Docker environment. This
spins up the PostgreSQL service and runs the Django test suite inside the
`app` container.

```bash
./generate_env.sh
docker compose build
docker compose up -d db
docker compose run --rm app /usr/src/venvs/app-main/bin/python manage.py test
docker compose down -v
```

## Deploying on Debian\u00a012

Make sure Docker and Docker Compose are installed:

```bash
sudo apt update
sudo apt install docker.io docker-compose -y
```

Clone this repository and prepare your environment file as described above.
You can then test the stack with:

```bash
docker compose up --build --abort-on-container-exit --remove-orphans && \
docker compose down --volumes --remove-orphans
```

If everything starts correctly the application will exit once the containers
are stopped.

## Putting it behind Nginx for HTTPS

Install Nginx on the host and configure it as a reverse proxy:

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Use a tool like `certbot` to obtain TLS certificates and update the
server block to listen on port `443` with SSL enabled. Once configured,
requests to `https://example.com` will be forwarded to the Dockerized
Django application.

## Developing with VS Code

To test and iterate on the project inside a [Dev Container](https://containers.dev/), install VS Code with the "Dev Containers" extension. Then generate the environment file and reopen the folder in the container:

```bash
./generate_env.sh
code . # open in VS Code and select 'Dev Containers: Reopen in Container'
```

The container is defined by the root `.devcontainer/docker-compose.yml` and automatically installs all dependencies.

### Running the development server

Use the **ServerLive: localhost_debug_true_settings** launch configuration from `.vscode/launch.json` (press **F5**). This runs:

```bash
python app-main/manage.py runserver 0.0.0.0:3000 --settings pwned_proxy.localhost_debug_true_settings
```

`localhost_debug_true_settings.py` enables `DEBUG` and relaxed CORS, so the app is available at <http://localhost:3000/> for interactive debugging.
