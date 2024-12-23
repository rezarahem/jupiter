#!/bin/bash

if [[ -z "$DOMAIN" || -z "$EMAIL" || -z "$APP" || -z "$REPO" ]]; then
  echo "Error: Missing required environment variables."
  echo "Please ensure DOMAIN, EMAIL, and APP are set."
  exit 1
fi

# Check if SSL certificate exists for the given domain
if [ ! -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
  ./jux/set-ssl.sh $DOMAIN $EMAIL
  if [ $? -eq 0 ]; then
    echo "SSL certificate successfully created for $DOMAIN"
  else
    echo "Error: Failed to create SSL certificate for $DOMAIN"
    exit 1
  fi
else
  echo "SSL certificate already exists for $DOMAIN"
fi

# Verify SSL certificate
openssl x509 -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem -noout -text > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "SSL certificate for $DOMAIN is valid"
else
  echo "Error: SSL certificate for $DOMAIN is invalid"
  exit 1
fi

# Check if reverse proxy configuration exists for the given domain
if [ ! -f /etc/nginx/sites-available/$APP ]; then
  ./jux/set-reverse-proxy.sh $DOMAIN $APP
  if [ $? -eq 0 ]; then
    echo "Reverse proxy successfully configured for $APP"
  else
    echo "Error: Failed to configure reverse proxy for $APP"
    exit 1
  fi
else
  echo "Reverse proxy configuration already exists for $APP"
fi

# Test Nginx configuration
nginx -t
if [ $? -eq 0 ]; then
  echo "Nginx configuration test passed"
else
  echo "Error: Nginx configuration test failed"
  exit 1
fi


# Change directory to the project folder
cd ./jupiter

if [ -d "$APP" ]; then
  echo "Directory $APP already exists. Pulling latest changes..."
  cd "$APP" && git pull
else
  echo "Cloning repository from $REPO..."
  git clone "$REPO" "$APP"
  cd "$DIR"
fi

# Start Docker containers
sudo docker-compose up -d
if [ $? -eq 0 ]; then
  echo "Docker containers started successfully"
else
  echo "Error: Failed to start Docker containers"
  exit 1
fi

# Get the ID of the last built Docker image for the application
LAST_IMAGE_ID=$(docker images --filter=reference="$APP:latest" --format "{{.ID}}")

# Build a new Docker image for the application
echo "Building the Docker image..."
docker build -t "$APP" -f docker/Dockerfile.nextjs .

# Default settings
BACKUP_ENABLED=false
# If there was a previous image, tag it as a backup
if [ -n "$LAST_IMAGE_ID" ]; then
  docker tag "$LAST_IMAGE_ID" "$APP:backup"
  echo "Backup image tagged as $APP:backup"
  BACKUP_ENABLED=true
else
  echo "No existing 'latest' image found, skipping making backup image."
fi


# Check and display the container IDs for Apollo (port 3000) and Artemis (port 3001), skipping health checks if not found
cu_apollo=$(docker ps --filter "publish=3000" --format "{{.ID}}")
if [ -z "$cu_apollo" ]; then
  echo "No container found for current Apollo. Skipping health check for current Apollo."
else
  echo "Container ID for current Apollo: $cu_apollo"
fi
cu_artemis=$(docker ps --filter "publish=3001" --format "{{.ID}}")
if [ -z "$cu_artemis" ]; then
  echo "No container found for current Artemis. Skipping health check for current Artemis."
else
  echo "Container ID for current Artemis: $cu_artemis"
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
    echo "Rolling back to backup version..."


    # Stop and remove unhealthy container
    sudo docker stop "$(docker ps --filter "publish=$port" --format "{{.ID}}")"
    sudo docker run --rm -d -p "$port:$port" --network "$APP" --name "$nickname" "$APP:backup"

    echo "Rolled back to backup."
    exit 1
  fi

  echo "$nickname (port $port) succeeded."
  return 0
}

if [ -n "$cu_apollo" ] && [ -n "$cu_artemis" ]; then
  echo "Both Apollo and Artemis are available."
elif [ -n "$cu_apollo" ] || [ -n "$cu_artemis" ]; then
  echo "One of Apollo or Artemis is available, the other is not."
else
  echo "Neither Apollo nor Artemis is available."
fi

