# !/bin/bash

# Check for required configuration values
if [[ -z "$APP" ]]; then
  echo "Error: Missing required configuration value for APP."
  exit 1
fi

# Function to perform health check on container
check_health() {
  local port=$1
  local nickname=$2
  local health_check_url="http://localhost:$port/api/hc"
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

  sudo docker run --rm -d -p "$port:$port" --network "$APP" --name "$nickname" "$APP:latest"
  sleep 5

  if ! check_health "$port" "$nickname"; then
    health_flags["$nickname"]=false
    echo "$nickname (port $port) failed."
    
    echo "Checking if backup image for $nickname is available..."
    BACKUP_IMAGE_ID=$(sudo docker images --filter=reference="$APP:backup" --format "{{.ID}}")

    if [ -z "$LAST_IMAGE_ID" ]; then
      echo "Backup image for $nickname is not available."
      echo "Exiting due to unhealthy container."
      exit 1
    else
      echo "Backup image for $nickname is available."

      sudo docker stop "$(docker ps --filter "publish=$port" --format "{{.ID}}")"
      sudo docker run --rm -d -p "$port:$port" --network "$APP" --name "$nickname" "$APP:backup"

      echo "Rolled back to backup due to unhealthy container."
      exit 1
    fi
  else
    echo "$nickname (port $port) succeeded."
  fi
}

# Start and check Apollo
start_and_check_container 3000 "apollo"

# Start and check Artemis
start_and_check_container 3001 "artemis"

echo "All containers started and are healthy. Successful Deployment."
