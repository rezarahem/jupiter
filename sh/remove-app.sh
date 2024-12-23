#!/bin/bash

remove_folder() {
  local folder_name=$1
  local folder_path="./jupiter/$folder_name"

 if [ -d "$folder_path" ]; then
    rm -rf "$folder_path"  
    echo "${folder_name^}"
  else
    echo ""
  fi

}

if [ -z "$1" ]; then
  echo "Please provide an app name."
  exit 1
fi

remove_folder $1
