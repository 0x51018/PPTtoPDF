#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-$HOME/apps/ppttopdf/deploy-live}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
COMPOSE_FILE="${COMPOSE_FILE:-deploy/home/docker-compose.yml}"
COMPOSE_ENV_FILE="${COMPOSE_ENV_FILE:-deploy/home/.env}"

echo "[PPTtoPDF] Home deploy from ${APP_DIR} (${DEPLOY_BRANCH})"
cd "${APP_DIR}"

git fetch origin "${DEPLOY_BRANCH}" --depth=1
git checkout -B "${DEPLOY_BRANCH}" "origin/${DEPLOY_BRANCH}"

test -f "${COMPOSE_FILE}"

if [[ ! -f "${COMPOSE_ENV_FILE}" ]]; then
  cp deploy/home/.env.example "${COMPOSE_ENV_FILE}"
fi

if [[ ! -f "deploy/home/api.env" ]]; then
  cp deploy/home/api.env.example deploy/home/api.env
fi

docker network inspect proxy >/dev/null 2>&1

docker compose --env-file "${COMPOSE_ENV_FILE}" -f "${COMPOSE_FILE}" up -d --build --wait --wait-timeout 120

docker compose --env-file "${COMPOSE_ENV_FILE}" -f "${COMPOSE_FILE}" exec -T api \
  node -e "fetch('http://127.0.0.1:3001/api/health').then(async (response)=>{const body=await response.json(); if(!response.ok || !body.ok) process.exit(1)}).catch(()=>process.exit(1))"

docker compose --env-file "${COMPOSE_ENV_FILE}" -f "${COMPOSE_FILE}" exec -T web \
  node -e "fetch('http://127.0.0.1:3000').then((response)=>{if(!response.ok)process.exit(1)}).catch(()=>process.exit(1))"

echo "[PPTtoPDF] Home deploy finished successfully."
