#!/bin/bash

if [ -z "$1" ]; then
  portNum=1
else
  portNum=$1
fi

find_open_ports() {
  local num_ports="$1"
  local port=8000 
  local open_ports=()

  while [ ${#open_ports[@]} -lt "$num_ports" ]; do
    if ! lsof -i :$port > /dev/null 2>&1; then
      open_ports+=($port)
    fi
    ((port++)) 
  done
  
  echo $(IFS=:; echo "${open_ports[*]}")
}

find_open_ports "$portNum"




