#!/bin/bash

echo "Removing Nginx and Certbot from the system..."

# Stop and disable Nginx service
sudo systemctl stop nginx
sudo systemctl disable nginx

# Remove Nginx
sudo apt-get purge --auto-remove nginx nginx-common -y
sudo apt-get autoremove -y
sudo apt-get autoclean

# Check if any Nginx configuration files are left
NGINX_DIR="/etc/nginx"
if [ -d "$NGINX_DIR" ]; then
  echo "Removing leftover Nginx configuration files..."
  sudo rm -rf "$NGINX_DIR"
fi

# Check if any logs are left
NGINX_LOG_DIR="/var/log/nginx"
if [ -d "$NGINX_LOG_DIR" ]; then
  echo "Removing leftover Nginx logs..."
  sudo rm -rf "$NGINX_LOG_DIR"
fi

# Stop and remove Certbot
echo "Removing Certbot..."
sudo apt-get purge --auto-remove certbot -y

# Remove Certbot configuration and certificates
CERTBOT_DIR="/etc/letsencrypt"
if [ -d "$CERTBOT_DIR" ]; then
  echo "Removing Certbot certificates and configurations..."
  sudo rm -rf "$CERTBOT_DIR"
fi

# Optional: Remove Python packages related to Certbot
if command -v pip &>/dev/null; then
  echo "Removing Certbot Python packages..."
  pip uninstall certbot -y
fi

# Clean up any remaining dependencies
sudo apt-get autoremove -y
sudo apt-get autoclean

echo "Nginx and Certbot have been removed completely."
