#!/bin/bash

set -e

URL="https://raw.githubusercontent.com/rezarahem/jupiter-core/refs/heads/sh/scripts.tar.gz"
FILE="scripts.tar.gz"

# Download the tar.gz file
echo "Downloading $URL..."
curl -o "$FILE" -L "$URL"

# Check if the download was successful
if [ $? -eq 0 ]; then
    echo "Downloaded successfully to $FILE."
else
    echo "Failed to download file."
    exit 1
fi

# Extract the tar.gz file into the current directory
echo "Extracting $FILE to the current directory..."
tar -xzf "$FILE"

# Check if the extraction was successful
if [ $? -eq 0 ]; then
    echo "Extraction completed successfully."
    rm $FILE
else
    echo "Extraction failed."
    exit 1
fi

chmod +x ~/setup.sh


