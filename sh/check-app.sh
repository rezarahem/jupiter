#!/bin/bash

ports=(
  "49152:49153"
  "49154:49155"
  "49156:49157"
  "49158:49159"
  "49160:49161"
  "49162:49163"
  "49164:49165"
  "49166:49167"
  "49168:49169"
  "49170:49171"
  "49172:49173"
  "49174:49175"
)

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
  echo ""
else
  mkdir -p "$folder_path"

  for port_pair in "${ports[@]}"; do
    even_port=$(echo "$port_pair" | cut -d':' -f1)
    odd_port=$(echo "$port_pair" | cut -d':' -f2)

    if ! docker ps --filter "publish=$even_port" --filter "publish=$odd_port" --format "{{.Ports}}" | grep -q "$even_port" && ! docker ps --filter "publish=$odd_port" --format "{{.Ports}}" | grep -q "$odd_port"; then
      echo "$even_port:$odd_port"
      exit 0
    fi
  done
  echo "no-port"
fi
