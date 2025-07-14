# Pwned Proxy Combined

This repository contains both the Django backend (`pwned-proxy-backend`) and the Next.js frontend (`pwned-proxy-frontend`).
A docker compose file is provided to simplify running the entire stack.

## Requirements

* Debian 12 with [Docker](https://www.docker.com/) and Docker Compose installed.
* Two environment files:
  * `pwned-proxy-backend/.env`
  * `pwned-proxy-frontend/app-main/.env.local`

## Preparing the environment

1. Install Docker and Docker Compose:

   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   ```

2. Clone this repository on your server.

3. Create the backend environment file. A helper script fills in reasonable defaults:

   ```bash
   cd pwned-proxy-backend
   ./generate_env.sh
   ```

   Edit the generated `.env` and set strong values for at least `DJANGO_SECRET_KEY` and `POSTGRES_PASSWORD`.
   You may also supply a value for `HIBP_API_KEY` and other optional settings.

4. Create the frontend environment file by copying the example:

   ```bash
   cd ../pwned-proxy-frontend/app-main
   cp .env.local.example .env.local
   ```

   Adjust `NEXT_PUBLIC_HIBP_PROXY_URL` if the backend is exposed on a different host or port. Additional optional
   variables such as `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_CONTACT_EMAIL` may be set as required.

Return to the repository root once the environment files have been prepared.

## Running the stack

From the repository root execute:

```bash
docker compose up --build -d
```

The services started are:

- **backend** – Django application available on port **8000**
- **frontend** – Next.js frontend served on port **3000**
- **db** – PostgreSQL instance used by the backend

The containers can be stopped with:

```bash
docker compose down
```

## First time setup

When the backend container starts for the first time it will apply migrations, create a superuser and, if `HIBP_API_KEY`
was provided, import initial data. The credentials are printed in the backend logs.

You can access the frontend at [http://localhost:3000](http://localhost:3000) and the Django admin interface at
[http://localhost:8000/admin/](http://localhost:8000/admin/).

