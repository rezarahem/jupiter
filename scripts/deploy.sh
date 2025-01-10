#!/bin/bash

if [[ -z "$APP" ]]; then
  echo "Missing app name."
  exit 1
fi

jux="$HOME/jupiter/jux"
CONFIG_FILE="$HOME/jupiter/$APP.config"

# Load the configuration file
if [[ -f "$CONFIG_FILE" ]]; then
  source "$CONFIG_FILE"
else
  echo "Error: Configuration file not found at $CONFIG_FILE."
  exit 1
fi

if [[ -z "$DOMAIN" || -z "$EMAIL" || -z "$WEB" || -z "$APOLLO" || -z "$ARTEMIS" || -z "$REPO" ]]; then
  echo "Error: Missing required environment variables."
  echo "DOMAIN=$DOMAIN"
  echo "EMAIL=$EMAIL"
  echo "WEB=$WEB"
  echo "APOLLO=$APOLLO"
  echo "ARTEMIS=$ARTEMIS"
  echo "REPO=$REPO"
  exit 1
fi

# Check if SSL certificate exists for the given domain
if [ ! -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
  # Create SSL certificate if not found
  $jux/set-ssl.sh $DOMAIN $EMAIL
  if [ $? -eq 0 ]; then
    echo "SSL certificate successfully created for $DOMAIN"
    sleep 2
  else
    echo "Error: Failed to create SSL certificate for $DOMAIN"
    exit 1
  fi
else
  echo "SSL certificate already exists for $DOMAIN"
  
  # Verify if the existing SSL certificate is valid
  openssl x509 -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem -noout -text > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "SSL certificate for $DOMAIN is valid"
  else
    echo "Warning: SSL certificate for $DOMAIN is invalid. Attempting to recreate the certificate..."
    
    # Try to create a new certificate even if the old one is invalid
    $jux/set-ssl.sh $DOMAIN $EMAIL
    if [ $? -eq 0 ]; then
      echo "SSL certificate successfully recreated for $DOMAIN"
      sleep 2
    else
      echo "Error: Failed to create a new SSL certificate for $DOMAIN"
      exit 1
    fi
  fi
fi

# Check if reverse proxy configuration exists for the given domain
if [ ! -f /etc/nginx/sites-available/$APP ]; then
  $jux/set-reverse-proxy.sh $DOMAIN $APP $APOLLO $ARTEMIS
  if [ $? -eq 0 ]; then
    echo "Reverse proxy successfully configured for $APP"
    sleep 2
  else
    echo "Error: Failed to configure reverse proxy for $APP"
    exit 1
  fi
else
  echo "Reverse proxy configuration already exists for $APP"
fi

# Set the directory path
appDir="$HOME/jupiter/apps/$APP"

# Check if the directory exists
if [ ! -d "$appDir" ]; then
  # If the directory does not exist, create it
  mkdir -p "$appDir"
  echo "Directory $appDir created."
fi

# Change into the app directory
cd "$appDir"

if [ -d ".git" ]; then
  echo "Git repository already exists. Pulling latest changes..."
  git pull
else
  echo "Cloning repository from $REPO into the current directory..."
  git clone "$REPO" .
fi

# Check if the network exists
if docker network ls --format "{{.Name}}" | grep -q "^$APP$"; then
  echo "Docker network $APP already exists."
else
  # Create the network if it doesn't exist
  docker network create "$APP"
  if [ $? -eq 0 ]; then
    echo "Docker network $APP has been created successfully."
  else
    echo "Failed to create Docker network $APP."
    exit 1
  fi
fi

# Get the ID of the last built Docker image for the application
LAST_IMAGE_ID=$(docker images --filter=reference="$APP:latest" --format "{{.ID}}")
LAST_BACKUP_IMAGE_ID=$(docker images --filter=reference="$APP:backup" --format "{{.ID}}")

# Build a new Docker image for the application
echo "Building the Docker image..."
docker build -t "$APP:latest" .

# If there was a previous image, tag it as a backup
if [ -n "$LAST_IMAGE_ID" ]; then
  docker tag "$LAST_IMAGE_ID" "$APP:backup"
  echo "Backup image tagged as $APP:backup"
else
  echo "No existing 'latest' image found, skipping making backup image."
fi

if [ -n "$LAST_BACKUP_IMAGE_ID" ]; then
  docker rmi "$LAST_BACKUP_IMAGE_ID"
  echo "Removed previous backup image with ID $LAST_BACKUP_IMAGE_ID"
else
  echo "No existing backup image found, skipping removal."
fi

check_health() {
  local port=$1
  local nickname=$2
  local health_check_url="http://localhost:$port/api/hc"
  local current=$(docker ps --filter "publish=$port" --format "{{.ID}}")

  if [[ -z "$current" ]]; then
    echo "No container found for port $port!"
    return 1
  fi

  echo "Checking health of container ($nickname) on port $port..."

  if curl --silent --fail --max-time 30 "$health_check_url" > /dev/null; then
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

  echo "Handling container ($nickname) on port $port..."

  # Stop and remove any existing container
  local current=$(docker ps --filter "publish=$port" --format "{{.ID}}")

  if [[ -n "$current" ]]; then
    sudo docker stop "$current"
    echo "Stopped existing container on port $port."
  fi

  # Start new container with the 'latest' tag
  sudo docker run --rm -d -p "$port:3000" --network "$APP" --name "$nickname" "$APP:latest"
  echo "Started new container ($nickname) with the 'latest' image."

  # Allow time for the container to start
  sleep 5

  # Check health of the new container
  if ! check_health "$port" "$nickname"; then
    echo "$nickname (port $port) failed."

    # Find the new container
    local new=$(docker ps --filter "publish=$port" --format "{{.ID}}")

    if [ -n "$new" ]; then
      sudo docker stop "$new"
      echo "Stopped unhealthy container."

      if [ -n "$LAST_IMAGE_ID" ]; then
        echo "Rolling back to backup version..."

        # Run backup container
        sudo docker run --rm -d -p "$port:$port" --network "$APP" --name "$nickname" "$APP:backup"
        echo "Unhealthy container rolled back to backup."

        # Remove the current 'latest' image (the one that failed)
        sudo docker rmi "$APP:latest"
        echo "Removed the unhealthy 'latest' image."

        # Tag the backup image as 'latest'
        sudo docker tag "$APP:backup" "$APP:latest"
        echo "Backup image retagged as $APP:latest"

        exit 1
      else 
        # No backup image, just remove the unhealthy container and the 'latest' image
        sudo docker rmi "$APP:latest"
        echo "Removed the unhealthy 'latest' image."
        echo "Exiting due to unhealthy container."
        exit 1
      fi

    else 
      echo "No container found to stop. Exiting..."
      exit 1   
    fi
  fi

  echo "$nickname (port $port) succeeded."
  return 0
}

handle_container $APOLLO "${APP}_apollo"
handle_container $ARTEMIS "${APP}_artemis"

echo "All containers started and are healthy. Successful Deployment."

