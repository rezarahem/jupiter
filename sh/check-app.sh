#!/bin/bash

# This range equals 424 apps.
start_port=49152
end_port=49999

if [ -z "$1" ]; then
  echo "Please provide an app name."
  exit 1
fi

app_name=$1
jupiter="./jupiter"
apps='./jupiter/apps'
app="$apps/$app_name"

if [ ! -d "$jupiter" ]; then
  mkdir -p "$jupiter"
fi

if [ ! -d "$apps" ]; then
  mkdir -p "$apps"
fi

if [ -d "$app" ]; then
  echo "409@Already in use"
  exit 0
fi

if ! command -v docker &> /dev/null; then
  echo "Docker is not installed or not in PATH"
  exit 1
fi

if ! docker info &> /dev/null; then
  echo "Docker is not running"
  exit 1
fi

for (( port1=$start_port; port1<=$end_port; port1++ )); do
  port2=$(( port1 + 1 ))

  if ! docker ps --filter "publish=$port1" --format "{{.Ports}}" | grep -q "$port1" && \
     ! docker ps --filter "publish=$port2" --format "{{.Ports}}" | grep -q "$port2"; then

    mkdir -p "$app"
    echo "200@$port1:$port2"
    exit 0
  fi
done

echo "206@No ports available"
exit 0
