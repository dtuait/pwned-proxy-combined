# Pwned Proxy Combined

## Purpose of the Tool

Imagine you are very big enterprise with a lot of domains and branches or imagine that you are a CERT/CSIRT for the National Research and Education Network (NREN) of a country, and you have a haveibeenpwned subscription for accessing the API (https://haveibeenpwned.com/Subscription). You have verified a lot of domains belonging to your enterprise or your constituents (universities in our example) and you now get notifications for all of your domains and send out the appropriate reports afterwards. While everyone is happy with this, there are some it-departments within your enterprise (or universities) that would like to utilize the haveibeenpwned API and use scripts to collect data and do stuff with it. The problem is, you do not want to hand out your API key to them, because then they would be able to see data that belong to other branches/departments/universities. So, this is where, this tool comes into play.
It acts as a proxy API that allows multiple universities to access their HIBP data exactly as if they had their own HaveIBeenPwned subscription. Separate API keys are created for each branch/department/university and they can query only their own data.

## How to Get Started

### First time setup

When the backend container starts for the first time it will apply migrations and create a superuser. If `HIBP_API_KEY`
is set a fresh domain list is imported. Regardless of whether the key is provided, the predefined groups are seeded
with API keys so the proxy works out of the box. On subsequent starts the value of `HIBP_API_KEY` in
`pwned-proxy-backend/.env` is used to update the stored key automatically. The credentials are printed in the backend
logs.

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

### 2. Backend environment


Run the provided `generate_env.sh` script to create the required environment
files for both the backend and frontend. Random secrets are generated
automatically so you only need to supply your domains and HIBP key afterwards:

```bash
./generate_env.sh
```


### 3. Configure the frontend

The script copies `pwned-proxy-frontend/app-main/.env.local.example` to
`pwned-proxy-frontend/app-main/.env.local` and generates a new
`pwned-proxy-backend/.env`. Edit the generated files to set
`HIBP_API_KEY` and your domain names.

When running the Docker stack, keep `HIBP_PROXY_INTERNAL_URL` set to
`http://backend:8000` so the frontend can reach the API container. In the
devcontainer where both services run in the same container, change it to
`http://localhost:8000`.

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

Generate client API keys and download `seeded_api_keys.json`.  The **Groups** page
also provides buttons to export and import the current group/API key mapping for
backup purposes:

![Seed keys](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/5.2-django-seed-and-download-clienthibpkeys.png)


### 6. Start production

Run the stack in production mode by first generating the environment files and
then building the images:

```bash
./generate_env.sh
docker compose build && docker compose up -d
```

All services now include a `restart: unless-stopped` policy in
`docker-compose.yaml`. Docker automatically recreates them when the
daemon restarts, for example after a server reboot. Ensure the Docker
service itself is enabled with `sudo systemctl enable docker` so the
stack starts on boot.


