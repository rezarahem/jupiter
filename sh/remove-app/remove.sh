#!/bin/bash

if [ -z "$APP" || -z "$DOMAIN" || -z $WEB ]; then
  echo "Please provide an app name."
  exit 1
fi

# remove docker and app folder
# remover nginx and cerbot