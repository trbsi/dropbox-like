# Dropbox-like File Manager

A browser-based file manager. Create folders, upload files (name only), search, and delete, no authentication required.

**Stack:** Laravel 13 · React 19 · TypeScript · MySQL 8 · Nginx · Docker

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

No other local dependencies are required — PHP, Node.js, and MySQL all run inside containers.

---

## Quick Start (Docker)

```bash
bash startup.sh
```

This script will:

1. Copy `.env.example` → `.env`
2. Build and start all containers (`app`, `nginx`, `mysql`, `phpmyadmin`)
3. Install PHP and Node dependencies inside the container
4. Build frontend assets
5. Generate the app key and run database migrations

Once complete, open **http://localhost:8000/filesystem**

- App: http://localhost:8000
- phpMyAdmin:  http://localhost:8080

---

## Development Mode

After the initial setup, run Vite in watch mode to enable hot module replacement:

```bash
docker compose exec laravelx_app npm run dev -- --host 0.0.0.0
```

You only need the Vite dev server for
frontend changes

---

## Stopping / Resetting

```bash
docker compose down
```

# Frontend
  API Layer
  - resources/js/api/filesystem.ts - All HTTP calls: list nodes, create/delete files and folders, search, fetch breadcrumb ancestors

  Page / UI
  - resources/js/pages/filesystem.tsx - Main filesystem page: renders the file/folder tree, handles navigation, search, create, and delete operations

  Breadcrumb Components
  - resources/js/components/breadcrumbs.tsx - Breadcrumb navigation wrapper used on the filesystem page
  - resources/js/components/ui/breadcrumb.tsx - Base reusable breadcrumb primitives (list, item, link, separator)
