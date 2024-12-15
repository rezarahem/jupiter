#!/bin/bash

set -e

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit 1
fi


sudo apt update && apt upgrade -y

sudo ./jupiter/docker.sh

# sudo ufw allow 'Nginx Full'

