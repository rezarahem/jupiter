#!/bin/bash

if [[ -z "$DOMAIN" || -z "$EMAIL" || -z "$APP" || -z "$WEB" || -z "$APOLLO" || -z "$ARTEMIS" || -z $REPO ]]; then
  echo "Error: Missing required environment variables."
  echo "DOMAIN=$DOMAIN"
  echo "EMAIL=$EMAIL"
  echo "APP=$APP"
  echo "WEB=$WEB"
  echo "APOLLO=$APOLLO"
  echo "ARTEMIS=$ARTEMIS"
  echo "REPO=$REPO"
  exit 1
fi

config=$HOME/jupiter/$APP.config

if [ ! -f "$config" ]; then
  touch "$config"
fi

echo "DOMAIN=$DOMAIN" > "$config"
echo "EMAIL=$EMAIL" >> "$config"
echo "APP=$APP" >> "$config"
echo "WEB=$WEB" >> "$config"
echo "APOLLO=$APOLLO" >> "$config"
echo "ARTEMIS=$ARTEMIS" >> "$config"
echo "REPO=$REPO" >> "$config"

echo "Config file updated at $config"
