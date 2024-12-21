#!/bin/bash

if [[ -z "$DOMAIN" || -z "$EMAIL" || -z "$APP" ]]; then
  echo "Error: Missing required environment variables."
  echo "Please ensure DOMAIN, EMAIL, and APP are set."
  exit 1
fi

echo "Loaded configuration:"
echo "DOMAIN=$DOMAIN"
echo "EMAIL=$EMAIL"
echo "APP=$APP"

# Check if SSL certificate exists for the given domain
if [ ! -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
  ./jux/set-ssl.sh $DOMAIN $EMAIL
fi

# Check if reverse proxy configuration exists for the given domain
if [ ! -f /etc/nginx/sites-available/$APP ]; then
  ./jux/set-reverse-proxy.sh $DOMAIN $APP
fi

# ...additional deployment steps...
