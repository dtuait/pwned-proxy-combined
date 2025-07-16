# Pwned Proxy Combined

## Purpose of the Tool

Pwned Proxy replicates the official HIBP API endpoint signature. Customers only
need to change the domain and HIBP key to use this service. It acts as a proxy
that allows multiple universities to access their HIBP data exactly as if they
had their own HaveIBeenPwned subscription, providing the same service for free.

## How to Get Started

### First time setup

When the backend container starts for the first time it will apply migrations and create a superuser.
The credentials are printed in the backend logs.

You can access the frontend at [http://localhost:3000](http://localhost:3000) and the Django admin interface at
[http://localhost:8000/admin/](http://localhost:8000/admin/).

### Example setup

The following walkthrough demonstrates a complete installation using Docker. It
assumes `domainthatyouown.com` and `api.domainthatyouown.com` are proxied to
`localhost:3000` and `localhost:8000` respectively.

### 1. Clone the repository

```bash
git clone https://github.com/dtuait/pwned-proxy-combined
```

### 2. Prepare backend environment

Generate the `.env` file by running `generate_env.sh` inside the backend
directory. This creates `.env` with random values:



Example output:

```bash
cd pwned-proxy-backend && ./generate_env.sh
#### Example output

user@srv:~/Projects/pwned-proxy-combined/pwned-proxy-backend
$ cat ./pwned-proxy-combined/pwned-proxy-backend/.env
# Environment configuration for Pwned Proxy
# Copy this file to `.env` and replace the placeholder values.
# Generate strong values at https://www.random.org/passwords/?num=5&len=32&format=html&rnd=new

# PostgreSQL configuration
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=dev-db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=ElxMBu0b5Ya9165uCmbEXQ

# Django secret key
DJANGO_SECRET_KEY=nm_9d0Wcm14CwG2e54bG15L0Op0RnBqj3KcKCFxUNBibSBrbANR2n6G41Ji4Lx2tPwg

# These can be left empty; startup scripts will handle them
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_PASSWORD=c0mcj8OxwMBwnZE1nyTpEQ
SERVICE_FQDN_APP=api.domainthatyouown.com
PWNED_PROXY_DOMAIN=api.domainthatyouown.com

# Set to 'true' to enable Django debug mode
DJANGO_DEBUG=false
```


### 3. Configure the frontend

Copy the example configuration and provide your HIBP and optional Google
Analytics keys:

```bash
cd ../pwned-proxy-frontend/app-main
cp .env.local.example .env.local
nano .env.local
NEXT_PUBLIC_HIBP_PROXY_URL=http://api.domainthatyouown.com/
NEXT_PUBLIC_GA_MEASUREMENT_ID=<google_analytics_measurement_id> # add if you analytics
NEXT_PUBLIC_CONTACT_EMAIL=person@email.com

```

### 4. Start the stack

Return to the repository root and launch the containers:

```bash
docker compose up --build -d
```

### 5. Configure the API

Open `https://api.domainthatyouown.com/admin` or `localhost:8000/admin` and log in with the admin
credentials printed during startup.

![Login](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/1-django-adminlogin.png)

Add your HIBP key and save it:

![Add key](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/2-django-add-hibpkey.png)
![Save key](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/3-django-savehibpkey.png)

Import the domain list:

![Import domains](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/4.1-django-importdomains.png)

Generate client API keys and download `seeded_api_keys.json`:

![Seed keys](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/5.2-django-seed-and-download-clienthibpkeys.png)


