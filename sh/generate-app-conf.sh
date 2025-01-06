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
