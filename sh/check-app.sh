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

if [ ! -d "$app" ]; then
  mkdir -p "$app"
  echo "201@App folder created"
else
  echo "409@Already in use"
  exit 0
fi

for (( port1=$start_port; port1<=$end_port; port1++ )); do
  port2=$(( port1 + 1 ))

  if ! lsof -i:"$port1" -sTCP:LISTEN &> /dev/null && \
     ! lsof -i:"$port2" -sTCP:LISTEN &> /dev/null; then
    echo "200@$port1:$port2"
    exit 0
  fi
done

echo "206@No ports available"
exit 0
