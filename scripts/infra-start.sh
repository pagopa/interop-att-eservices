#!/bin/bash

docker compose -f ../docker/docker-compose.yml up -d

pnpm turbo install --filter pdnd-commons
pnpm turbo run drizzle:migrate --filter pdnd-commons
pnpm turbo run build --filter pdnd-commons
pnpm turbo run build --filter interop-jwt-generator

kms_output=$(aws --endpoint-url=http://localhost:4566 kms create-key --key-usage SIGN_VERIFY --customer-master-key-spec RSA_2048)
key_id=$(echo "$kms_output" | jq -r '.KeyMetadata.KeyId')

packages=(
  "digital-address-verification"
  "faily-status"
  "fiscalcode-verification"
  "keychain-mock"
  "piva-verification"
  "residence-submission"
  "residence-verification"
  "residence-verification-direct"
  "trial-service-api"
)

base_dir="../packages"

for package in "${packages[@]}"; do
  env_file="$base_dir/$package/.env"
  if [ -f "$env_file" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' '/^KMS_KEYID = /d' "$env_file"
    else
      sed -i '/^KMS_KEYID = /d' "$env_file"
    fi
  fi
  echo "KMS_KEYID = $key_id" >> "$env_file"
done

echo "KMS_KEYID updated in all .env files" &&

cd ../packages/trial-service-api && pnpm run start