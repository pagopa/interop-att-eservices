#!/bin/bash

docker compose -f ../docker/docker-compose.yml up -d

pnpm turbo install --filter pdnd-commons
pnpm turbo run drizzle:migrate --filter pdnd-commons
