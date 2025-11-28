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
  "signal-service"
)

update_env_variable() {
  local env_file="$1"
  local var_name="$2"
  local value="$3"
  local create_var="$4"

  if grep -q "^$var_name = " "$env_file"; then
    echo "Updating $var_name in $env_file"
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s/^$var_name = .*/$var_name = $value/" "$env_file"
    else
      sed -i "s/^$var_name = .*/$var_name = $value/" "$env_file"
    fi
  elif [ "$create_var" == "true" ]; then
    echo "Adding $var_name to $env_file"
    if [ -s "$env_file" ]; then
      echo "" >> "$env_file"
    fi
    echo "$var_name = $value" >> "$env_file"
  fi
}

for package in "${packages[@]}"; do
  env_file="packages/$package/.env"

  if [ -f "$env_file" ]; then
    update_env_variable "$env_file" "KMS_KEYCHAIN_PUBLICKEY_KID" "$key_id" "false"
    update_env_variable "$env_file" "KMS_KEYID" "$key_id" "true"
  fi
done

echo "KMS_KEYID updated in all .env files"

cd "packages/trial-service-api" && pnpm run start
