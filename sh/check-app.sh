#!/bin/bash

# Function to check if the folder exists in the current directory
check_folder_exists() {
  local folder_name=$1
  local folder_path="./$folder_name"  # Use relative path from current directory
  
  # Check if the folder exists
  if [ -d "$folder_path" ]; then
    echo ""
  else
    mkdir "$folder_path"
    echo "1"
  fi
}

# Ensure the script is receiving an argument
if [ -z "$1" ]; then
  echo "Please provide a folder name."
  exit 1
fi

# Example usage: Pass the folder name as an argument to the function
check_folder_exists "$1"
