#!/bin/bash

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <domain> <email>"
  exit 1
fi

DOMAIN=$1
EMAIL=$2

# Check if Certbot is installed, if not, exit
if ! command -v certbot &> /dev/null; then
  echo No Certbot is not installed 
  exit 1
fi

sudo certbot certonly --non-interactive --agree-tos -m $EMAIL -d $DOMAIN


# Reload Nginx to apply the new SSL configuration
sudo systemctl reload nginx