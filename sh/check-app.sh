#!/bin/bash

# This range equals 424 apps.
start_port=49152
end_port=49999

if [ -z "$1" ]; then
  echo "Please provide an config name."
  exit 1
fi

config_name=$1
jupiter="$HOME/jupiter" 
config="$jupiter/$config_name.config.sh"

if [ ! -d "$jupiter" ]; then
  mkdir -p "$jupiter"
  echo "Created Jupiter directory"
fi

if [ ! -f "$config" ]; then
  touch "$config"

  for (( port1=$start_port; port1<=$end_port; port1++ )); do
    port2=$(( port1 + 1 ))

    if ! lsof -i:"$port1" -sTCP:LISTEN &> /dev/null && \
      ! lsof -i:"$port2" -sTCP:LISTEN &> /dev/null; then
      echo "200@$port1:$port2"
      exit 0
    fi
  done
else
  echo "409@"$config_name" config already exists"
  exit 0
fi

echo "206@No ports available"
exit 0
