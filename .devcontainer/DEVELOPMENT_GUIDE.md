# Development Guide

## Starting the Backend (Django)

### In Development Container

1. **Set up environment variables:**
   ```bash
   cd /usr/src/project/pwned-proxy-backend
   ./generate_env.sh
   ```

2. **Activate the backend virtual environment:**
   ```bash
   source /usr/venv/backend/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations:**
   ```bash
   cd /usr/src/project/pwned-proxy-backend
   python manage.py migrate
   ```

5. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the Django development server:**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

The backend will be available at `http://localhost:8000`

### Alternative: Using Django's app-main directory

If you prefer to work from the app-main directory:

```bash
cd /usr/src/project/pwned-proxy-backend/app-main
source /usr/venv/backend/bin/activate
python manage.py runserver 0.0.0.0:8000
```

## Starting the Frontend (Next.js)

The frontend can be started using the VS Code tasks (see `.vscode/tasks.json`) or manually:

### Manual Start

1. **Install dependencies:**
   ```bash
   cd /usr/src/project/pwned-proxy-frontend/app-main
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Using VS Code Tasks

Use `Ctrl+Shift+P` → "Tasks: Run Task" and select:
- **"Start Frontend (Dev)"** - Starts the Next.js development server
- **"Build Frontend"** - Builds the frontend for production

## Database

The PostgreSQL database is automatically started with the devcontainer and is accessible at:
- **Host**: `db` (from within devcontainer) or `localhost` (from host)
- **Port**: `5432`
- **Database**: `pwned_proxy`
- **Username**: `postgres` 
- **Password**: `postgres`

## Environment Files

Make sure to create the necessary environment files:
- `pwned-proxy-backend/.env` (created by `generate_env.sh`)
- `pwned-proxy-frontend/app-main/.env.local`

## Development Workflow

1. Start the devcontainer
2. Database will start automatically
3. Activate the virtual environment and run the backend:
   ```bash
   source /usr/venv/backend/bin/activate
   python manage.py runserver 0.0.0.0:8000
   ```
4. Run frontend: Use VS Code task or `npm run dev`
5. Access the application at `http://localhost:3000`
