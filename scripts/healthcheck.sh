#!/usr/bin/env bash
set -euo pipefail
curl -fsS "${1:-http://localhost:3001}/api/health"
