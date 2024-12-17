#!/bin/bash

echo "Updating package lists..."
sudo apt-get update -y

echo "Installing Nginx..."
sudo apt-get install nginx -y

echo "Starting and enabling Nginx service..."
sudo systemctl start nginx
sudo systemctl enable nginx

echo "Installing Certbot and dependencies..."
sudo apt-get install software-properties-common -y
sudo add-apt-repository universe -y
sudo apt-get update -y
sudo apt-get install certbot python3-certbot-nginx -y

