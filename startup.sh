#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

echo "Starting Docker services..."
docker compose up -d --build

echo "Installing PHP dependencies..."
docker exec -it laravelx_app composer install

echo "Installing Node dependencies..."
docker exec -it laravelx_app npm install

echo "Building production assets..."
docker exec -it laravelx_app npm run build

echo "Project startup complete."
