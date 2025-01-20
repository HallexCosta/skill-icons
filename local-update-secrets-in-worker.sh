#!/bin/bash

while IFS= read -r line; do
  if [[ $line =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
    key=${BASH_REMATCH[1]}
    value=${BASH_REMATCH[2]}
    echo "Sending secret: $key"
    echo "$value" | wrangler secret put "$key"
  fi
done < .env
