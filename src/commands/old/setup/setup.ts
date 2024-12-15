import { Command } from 'commander';
import { readConfig } from '../../../utils/read-config.js';
import { streamMultiCommands } from '../../../utils/stream-multi-commands.js';

export const Setup = new Command('setup-vps').alias('sv').action(async () => {
  const config = readConfig();

  if (!config) {
    console.error('Config not found');
    return;
  }

  const { email, domain } = config;

  const createNginxScriptCommand = `
  sudo tee /tmp/create_nginx_config.sh > /dev/null <<'EOF'
#!/bin/bash

# Nginx config variables
DOMAIN="${domain}"
EMAIL="${email}"

# Generate the Nginx config
cat <<EOL > /etc/nginx/sites-available/myapp
limit_req_zone \$binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    listen 80;
    server_name \$DOMAIN;

    # Redirect all HTTP requests to HTTPS
    return 301 https://\$host\$request_uri;
}

upstream myapp {
    # Apollo
    server localhost:3000 max_fails=3 fail_timeout=10s;
    # Artemis
    server localhost:3001 max_fails=3 fail_timeout=10s;
}

server {
    listen 443 ssl;
    server_name \$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/\$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/\$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Enable rate limiting
    limit_req zone=mylimit burst=20 nodelay;

    location / {
        proxy_pass http://myapp;
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

# Set the correct permissions
chmod +x /tmp/create_nginx_config.sh
/tmp/create_nginx_config.sh

EOF
`;

  const nginx = [
    'sudo apt install nginx -y',
    'sudo rm -f /etc/nginx/sites-available/myapp',
    'sudo rm -f /etc/nginx/sites-enabled/myapp',
    'sudo systemctl stop nginx',
    'sudo apt install certbot -y',
    `sudo certbot certonly --standalone -d ${domain} --non-interactive --agree-tos -m ${email}`,
    'if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then sudo wget https://raw.githubusercontent.com/certbot/certbot/main/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -P /etc/letsencrypt/; fi',
    'if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048; fi',
    createNginxScriptCommand,
    'sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp || true',
    'sudo systemctl restart nginx',
  ];

  await streamMultiCommands([...nginx]);
});

const docker = [
  'sudo apt-get remove -y docker.io',
  'sudo apt-get remove -y docker-doc',
  'sudo apt-get remove -y docker-compose',
  'sudo apt-get remove -y docker-compose-v2',
  'sudo apt-get remove -y podman-docker',
  'sudo apt-get remove -y containerd',
  'sudo apt-get remove -y runc',
  'sudo apt update',
  'sudo apt install -y ca-certificates curl',
  'sudo install -m 0755 -d /etc/apt/keyrings',
  'sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc',
  'sudo chmod a+r /etc/apt/keyrings/docker.asc',
  'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null',
  'sudo apt update -y',
  'sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-compose',
];
