#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || exit

docker compose -f docker/docker-compose.yml up -d

pnpm i
pnpm run build
cd packages/commons
pnpm run drizzle:migrate
cd ../..

key_id=$(aws --endpoint-url=http://localhost:4566 kms create-key \
    --key-usage SIGN_VERIFY \
    --customer-master-key-spec RSA_2048 \
    --query 'KeyMetadata.KeyId' \
    --output text)

packages=(
  "digital-address-verification"
  "family-status"
  "fiscalcode-verification"
  "keychain-mock"
  "piva-verification"
  "residence-submission"
  "residence-verification"
  "residence-verification-direct"
  "trial-service-api"
)

for package in "${packages[@]}"; do
  env_file="packages/$package/.env"
  if [ -f "$env_file" ]; then
    if grep -q '^KMS_KEYID = ' "$env_file"; then
      echo "Updating KMS_KEYID in $env_file"
      if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/^KMS_KEYID = .*/KMS_KEYID = $key_id/" "$env_file"
      else
        sed -i "s/^KMS_KEYID = .*/KMS_KEYID = $key_id/" "$env_file"
      fi
    else
      echo "Adding KMS_KEYID to $env_file"
      if [ -s "$env_file" ]; then
        echo "" >> "$env_file"
      fi
      echo "KMS_KEYID = $key_id" >> "$env_file"
    fi
  fi
done

echo "KMS_KEYID updated in all .env files"

cd "packages/trial-service-api" && pnpm run start