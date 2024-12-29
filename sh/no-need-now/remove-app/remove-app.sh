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

if [ -z "$APP" || -z "$DOMAIN" || -z $WEB ]; then
  echo "Please provide an app name."
  exit 1
fi

remove_folder $APP
