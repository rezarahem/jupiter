#!/bin/bash

set -e

# remove run.sh
rm -f run.sh

# Prompt for variables
read -p "Enter your repo's SSH URL: " REPO
read -p "Enter your app name: " APP

# Generate the config.sh file
cat > root.config.sh <<EOF
# Configuration File

REPO="$REPO"
DIR="$APP"
EOF

echo "Generated config.sh with the provided configuration."

# Mark scripts as executable
chmod +x docker.sh
chmod +x nginx.sh 
chmod +x spinup.sh
chmod +x refresh.sh
chmod +x deploy.sh

# Run the scripts in sequence
./docker.sh

# Clone or Pull Latest Changes
if [ -d "$DIR" ]; then
  echo "Directory $DIR already exists. skip clone"
  cd "$DIR" && git pull
else
  echo "Cloning repository from $REPO..."
  git clone "$REPO" "$DIR"
  cd "$DIR"
fi


echo "Starting Docker Compose..."
docker-compose -f docker/docker-compose.base.yml up -d

./nginx.sh


echo "You're all set up! 👌"

