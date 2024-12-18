#!/bin/bash

# Function to check if the folder exists inside the jupiter folder
check_folder_exists() {
  local folder_name=$1
  local jupiter_path="./jupiter"
  local folder_path="$jupiter_path/$folder_name"  # Use relative path inside jupiter folder

  # Check if the jupiter folder exists, create it if it doesn't
  if [ ! -d "$jupiter_path" ]; then
    mkdir -p "$jupiter_path"
  fi
  
  # Check if the folder exists
  if [ -d "$folder_path" ]; then
    echo ""
  else
    mkdir -p "$folder_path"  # Create the folder, including any necessary parent directories
    echo "${folder_name^}"
  fi
}

# Ensure the script is receiving an argument
if [ -z "$1" ]; then
  echo "Please provide a folder name."
  exit 1
fi

check_folder_exists $1

  


