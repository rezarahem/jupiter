# !/bin/bash

set -e

# Load configuration file
if [[ -f config.sh ]]; then
  source config.sh
else
  echo "Error: config.sh file not found. Please run the setup script to generate it."
  exit 1
fi

# Check for required configuration values
if [[ -z "$IMAGE" || -z "$NET" ]]; then
  echo "Error: Missing required configuration values."
  echo "Please ensure IMAGE and NET are defined in config.sh."
  exit 1
fi

# Initialize health flags
declare -A health_flags
health_flags["apollo"]=true
health_flags["artemis"]=true

# Function to perform health check on container
check_health() {
  local port=$1
  local nickname=$2
  local health_check_url="http://localhost:$port/api/health"
  local container_id=$(sudo docker ps --filter "publish=$port" --format "{{.ID}}")

  if [ -z "$container_id" ]; then
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

# Function to start a container and check health
start_and_check_container() {
  local port=$1
  local nickname=$2

  sudo docker run --rm -d -p "$port:$port" --network "$NET" --name "$nickname" "$IMAGE:latest"
  sleep 5

  if ! check_health "$port" "$nickname"; then
    health_flags["$nickname"]=false
    echo "$nickname (port $port) failed."
  else
    echo "$nickname (port $port) succeeded."
  fi
}

# Start and check Apollo
start_and_check_container 3000 "apollo"

# Start and check Artemis
start_and_check_container 3001 "artemis"

# Final check for success
if [ "${health_flags["apollo"]}" = false ] && [ "${health_flags["artemis"]}" = false ]; then
  echo "Both containers failed health check."
  exit 1
fi

echo "Successful Deployment"

