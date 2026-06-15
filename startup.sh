#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

SERVICE="${SERVICE:-laravelx_app}"
SKIP_UP="${SKIP_UP:-0}"

if [[ "$SKIP_UP" != "1" ]]; then
  echo "Starting Docker services..."
  docker compose up -d --build
else
  echo "Skipping docker compose up (--SKIP_UP=1 enabled)"
fi

echo "Waiting for containers..."
sleep 3

echo "Installing PHP dependencies..."
docker exec -it "$SERVICE" composer install

echo "Installing Node dependencies..."
docker exec -it "$SERVICE" npm install

echo "Building production assets..."
docker exec -it "$SERVICE" npm run build

echo "Running database migrations..."
docker exec -it "$SERVICE" php artisan migrate --force

echo "Project startup complete."