#!/bin/bash

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <domain> <app>"
  exit 1
fi

DOMAIN=$1
APP=$2

# Stop Nginx temporarily to allow configuration changes
sudo systemctl stop nginx

# Create Nginx config with reverse proxy, SSL support, rate limiting, and streaming support
sudo cat > /etc/nginx/sites-available/$APP <<EOL
limit_req_zone \$binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    listen 80;
    server_name $DOMAIN;

    # Redirect all HTTP requests to HTTPS
    return 301 https://\$host\$request_uri;
}

upstream $APP {
    # Apollo
    server localhost:3000 max_fails=3 fail_timeout=10s; 
    # Artemis
    server localhost:3001 max_fails=3 fail_timeout=10s;
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Enable rate limiting
    limit_req zone=mylimit burst=20 nodelay;

    location / {
        proxy_pass http://$APP;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        
        # Disable buffering for streaming support
        proxy_buffering off;
        proxy_set_header X-Accel-Buffering no;
    }
}
EOL

# Create symbolic link if it doesn't already exist
sudo ln -s /etc/nginx/sites-available/$APP /etc/nginx/sites-enabled/$APP

# Restart Nginx to apply the new configuration
sudo systemctl restart nginx
