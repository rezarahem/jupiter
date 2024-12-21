#!/bin/bash

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <config_file>"
  exit 1
fi 

CONFIG_FILE=$1

if [[ ! -f $CONFIG_FILE ]]; then
  echo "Error: Configuration file not found."
  exit 1
fi

source $CONFIG_FILE

if [[ -z "$DOMAIN" || -z "$EMAIL" || -z "$APP" ]]; then
  echo "Error: Missing required configuration values."
  echo "Please ensure DOMAIN, EMAIL, and APP are defined in the configuration file."
  exit 1
fi

# Check if SSL certificate exists for the given domain
if [ ! -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
  ./set-ssl.sh $DOMAIN $EMAIL
fi

# Check if reverse proxy configuration exists for the given domain
if [ ! -f /etc/nginx/sites-available/$APP ]; then
  ./set-reverse-proxy.sh $DOMAIN $APP
fi

# ...additional deployment steps...
