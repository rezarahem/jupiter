#!/bin/bash

set -e

suod apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx