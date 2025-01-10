#!/bin/bash

if [[ -z "$APP" ]]; then
  echo "Missing app name."
  exit 1
fi

depPath="$HOME/jupiter/apps/${APP}_dep"

# Check if the directory exists
if [ ! -d "$depPath" ]; then
  mkdir -p "$depPath"
  echo "Directory $depPath created."
fi

cd "$depPath"

if [[ ! -f "docker-compose.yml" ]]; then
  echo "docker-compose.yml does not exist in the current folder."
  exit 1
fi

if sudo docker-compose up -d; then
  echo "All dependencies are up and running successfully."
else
  echo "Error: Failed to start dependencies with docker-compose."
  exit 1
fi


