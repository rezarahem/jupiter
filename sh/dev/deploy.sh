#!/bin/bash

set -e

# Load the configuration
if [[ -f config.sh ]]; then
  source config.sh
else
  echo "Error: config.sh file not found. Please run the setup script to generate it."
  exit 1
fi

# Validate required variables
if [[ -z "$REPO" || -z "$DIR" || -z "$IMAGE" ]]; then
  echo "Error: Missing required configuration values."
  echo "Please ensure REPO, DIR, and IMAGE are defined in config.sh."
  exit 1
fi

echo "Starting deployment for $IMAGE from repository $REPO into directory $DIR..."

# Clone or Pull Latest Changes
if [ -d "$DIR" ]; then
  echo "Directory $DIR already exists. Pulling latest changes..."
  cd "$DIR" && git pull
else
  echo "Cloning repository from $REPO..."
  git clone "$REPO" "$DIR"
  cd "$DIR"
fi

LAST_IMAGE_ID=$(docker images --filter=reference="$IMAGE:latest" --format "{{.ID}}")

echo "Building the Docker image..."
docker build -t "$IMAGE" .

if [ -n "$LAST_IMAGE_ID" ]; then
  docker tag "$LAST_IMAGE_ID" "$IMAGE:backup"
  echo "Backup image tagged as $IMAGE:backup"
else
  echo "No existing 'latest' image found, skipping backup."
fi

# Check if any container is running on port 3000
container_id_3000=$(docker ps --filter "publish=3000" --format "{{.ID}}")
# Check if any container is running on port 3001
container_id_3001=$(docker ps --filter "publish=3001" --format "{{.ID}}")

# If no containers are found on both ports, spin up the image
if [ -z "$container_id_3000" ] && [ -z "$container_id_3001" ]; then
  echo "No active containers on ports 3000 and 3001. Spinning up the containers..."
  cd ~
  ~/spinup.sh
else
  # If there are active containers, start refreshing the containers... 
  echo "Active containers found on ports 3000 and/or 3001. Refreshing..."
  cd ~
  ~/refresh.sh 
fi