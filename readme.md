# Run the app

1. `bash startup.sh`
2. Open http://localhost:8000/filesystem

# Run development vite

`docker compose exec app npm run dev -- --host 0.0.0.0`

# Frontend
  API Layer
  - resources/js/api/filesystem.ts - All HTTP calls: list nodes, create/delete files and folders, search, fetch breadcrumb ancestors

  Page / UI
  - resources/js/pages/filesystem.tsx - Main filesystem page: renders the file/folder tree, handles navigation, search, create, and delete operations

  Breadcrumb Components
  - resources/js/components/breadcrumbs.tsx - Breadcrumb navigation wrapper used on the filesystem page
  - resources/js/components/ui/breadcrumb.tsx - Base reusable breadcrumb primitives (list, item, link, separator)
