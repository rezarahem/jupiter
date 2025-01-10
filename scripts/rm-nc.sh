#!/bin/bash

# Stop and disable nginx service
sudo systemctl stop nginx
sudo systemctl disable nginx

# Remove Nginx package and dependencies
sudo apt-get remove --purge nginx nginx-common nginx-full -y
sudo apt-get autoremove --purge -y

# Remove any remaining Nginx config files
sudo rm -rf /etc/nginx
sudo rm -rf /var/www/html

# Stop and disable Certbot service
sudo systemctl stop certbot.timer
sudo systemctl disable certbot.timer

# Remove Certbot package
sudo apt-get remove --purge certbot python3-certbot-nginx -y
sudo apt-get autoremove --purge -y

# Remove any remaining Certbot files
sudo rm -rf /etc/letsencrypt
sudo rm -rf /var/lib/letsencrypt
sudo rm -rf /var/log/letsencrypt

# Clean up any additional unused packages and dependencies
sudo apt-get clean
