#!/bin/bash

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit 1
fi

sudo apt update && apt upgrade -y

sudo ./jupiter/docker.sh
sudo ./jupiter/nginx.sh


echo "Docker version:"
docker --version

echo "Docker Compose version:"
docker-compose --version

echo "Nginx version:"
nginx -v

echo "Certbot version:"
certbot --version






