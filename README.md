# Jupiter

**Jupiter** is an in-progress CLI tool designed to simplify the process of building, deploying, and managing modern web applications.

here can I remove backup boolean and user the LAST_IMAGE_ID istead

BACKUP=false
# If there was a previous image, tag it as a backup
if [ -n "$LAST_IMAGE_ID" ]; then
  docker tag "$LAST_IMAGE_ID" "$APP:backup"
  echo "Backup image tagged as $APP:backup"
  BACKUP=true
else
  echo "No existing 'latest' image found, skipping making backup image."
fi


check_health() {
  local port=$1
  local nickname=$2
  local health_check_url="http://localhost:$port/api/hc"
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
  sudo docker run --rm -d -p "$port:$port" --network "$APP" --name "$nickname" "$APP:latest"

  # Allow time for container to start
  sleep 5

  # Check health of the new container
  if ! check_health "$port" "$nickname"; then
    echo "$nickname (port $port) failed."
    
    if [[ "$BACKUP" == true ]]; then
      echo "Rolling back to backup version..."

      # Stop and remove unhealthy container
      sudo docker stop "$(docker ps --filter "publish=$port" --format "{{.ID}}")"
      sudo docker run --rm -d -p "$port:$port" --network "$APP" --name "$nickname" "$APP:backup"
      echo "Rolled back to backup."
      exit 1
    fi

    echo "Exiting due to unhealthy container."
    exit 1
  fi

  echo "$nickname (port $port) succeeded."
  return 0
}
