#!/bin/bash

if [[ -z "$DOMAIN" || -z "$EMAIL" || -z "$APP" ]]; then
  echo "Error: Missing required environment variables."
  echo "Please ensure DOMAIN, EMAIL, and APP are set."
  exit 1
fi

# Check if SSL certificate exists for the given domain
if [ ! -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
  ./jux/set-ssl.sh $DOMAIN $EMAIL
  if [ $? -eq 0 ]; then
    echo "SSL certificate successfully created for $DOMAIN"
  else
    echo "Error: Failed to create SSL certificate for $DOMAIN"
    exit 1
  fi
else
  echo "SSL certificate already exists for $DOMAIN"
fi

# Verify SSL certificate
openssl x509 -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem -noout -text > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "SSL certificate for $DOMAIN is valid"
else
  echo "Error: SSL certificate for $DOMAIN is invalid"
  exit 1
fi

# Check if reverse proxy configuration exists for the given domain
if [ ! -f /etc/nginx/sites-available/$APP ]; then
  ./jux/set-reverse-proxy.sh $DOMAIN $APP
  if [ $? -eq 0 ]; then
    echo "Reverse proxy successfully configured for $APP"
  else
    echo "Error: Failed to configure reverse proxy for $APP"
    exit 1
  fi
else
  echo "Reverse proxy configuration already exists for $APP"
fi

# Test Nginx configuration
nginx -t
if [ $? -eq 0 ]; then
  echo "Nginx configuration test passed"
else
  echo "Error: Nginx configuration test failed"
  exit 1
fi

# ...additional deployment steps...
