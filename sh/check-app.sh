#!/bin/bash

start_port=49152
end_port=49999

if [ -z "$1" ]; then
  echo "Please provide an app name."
  exit 1
fi

folder_name=$1
jupiter_path="./jupiter"
folder_path="$jupiter_path/$folder_name"

if [ ! -d "$jupiter_path" ]; then
  mkdir -p "$jupiter_path"
fi

if [ -d "$folder_path" ]; then
  echo "409@Already in use"
  exit 0
else
  mkdir -p "$folder_path"

  for (( port1=$start_port; port1<=$end_port; port1++ )); do
    port2=$(( port1 + 1 ))

    if ! docker ps --filter "publish=$port1" --format "{{.Ports}}" | grep -q "$port1" && \
       ! docker ps --filter "publish=$port2" --format "{{.Ports}}" | grep -q "$port2"; then
      echo "200@$port1:$port2"
      exit 0
    fi
  done

  echo "206@No ports"
  exit 0
fi
