#!/bin/bash

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <domain> <email>"
  exit 1
fi

DOMAIN=$1
EMAIL=$2

# Stop Nginx temporarily to allow Certbot to run in standalone mode
sudo systemctl stop nginx

# Check if Certbot is installed, if not, install it
if ! command -v certbot &> /dev/null; then
  sudo apt install certbot -y
fi

# Obtain SSL certificate using Certbot standalone mode
sudo certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos -m $EMAIL

# Ensure SSL files exist or generate them
if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then
  sudo wget https://raw.githubusercontent.com/certbot/certbot/main/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -P /etc/letsencrypt/
fi

if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
  sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
fi

# Restart Nginx to apply the new configuration
sudo systemctl restart nginx
