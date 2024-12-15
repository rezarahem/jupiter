#!/bin/bash

set -e

# Load configuration
if [[ -f config.sh ]]; then
  source config.sh
else
  echo "Error: config.sh file not found. Please run the setup script to generate it."
  exit 1
fi

# Validate configuration values
if [[ -z "$IMAGE" || -z "$NET" ]]; then
  echo "Error: Missing required configuration values."
  echo "Please ensure IMAGE and NET are defined in config.sh."
  exit 1
fi

# Helper function to check container health
check_health() {
  local port=$1
  local nickname=$2
  local health_check_url="http://localhost:$port/api/health"

  local container_id=$(docker ps --filter "publish=$port" --format "{{.ID}}")

  if [[ -z "$container_id" ]]; then
    echo "No container found for port $port!"
    return 1
  fi

  echo "Checking health of container ($nickname) on port $port..."

  if curl --silent --fail "$health_check_url" > /dev/null; then
    echo "Container ($nickname) on port $port is healthy!"
    return 0
  else
    echo "Container ($nickname) on port $port is unhealthy!"
    return 1
  fi
}

# Function to handle container lifecycle
handle_container() {
  local port=$1
  local nickname=$2

  echo "Handling container on port $port..."

  # Stop and remove any existing container
  local container_id=$(docker ps --filter "publish=$port" --format "{{.ID}}")
  if [[ -n "$container_id" ]]; then
    sudo docker stop "$container_id"
  fi

  # Start new container with the 'latest' tag
  sudo docker run --rm -d -p "$port:$port" --network "$NET" --name "$nickname" "$IMAGE:latest"

  # Allow time for container to start
  sleep 5

  # Check health of the new container
  if ! check_health "$port" "$nickname"; then
    echo "$nickname (port $port) failed."
    echo "Rolling back to backup version..."

    # Stop and remove unhealthy container
    sudo docker stop "$(docker ps --filter "publish=$port" --format "{{.ID}}")"
    sudo docker run --rm -d -p "$port:$port" --network "$NET" --name "$nickname" "$IMAGE:backup"
    return 1
  fi

  echo "$nickname (port $port) succeeded."
  return 0
}

# Handle Apollo container on port 3000
apollo_health=true
if ! handle_container 3000 "apollo"; then
  apollo_health=false
fi

# Handle Artemis container on port 3001
artemis_health=true
if ! handle_container 3001 "artemis"; then
  artemis_health=false
fi

# If both containers failed health checks, remove the latest image
if [[ "$apollo_health" == false && "$artemis_health" == false ]]; then
  echo "Both containers failed health check. Removing the latest image: $IMAGE"
  sudo docker rmi "$IMAGE:latest"
  exit 1
fi

echo "Successful Deployment"
