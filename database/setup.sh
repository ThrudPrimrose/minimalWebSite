#!/bin/bash

docker pull mongo

source ../.env

# For the data to persist
function volumeExists {
  if [ "$(docker volume ls -f name=$1 | awk '{print $NF}' | grep -E '^'$1'$')" ]; then
    return 0
  else
    return 1
  fi
}

if volumeExists $1; then
    echo "volume exists"
else
    echo "volume does not exist, will be created"
    docker volume create mongodb_data
fi

docker run -d -p 27017:27017 -v mongodb_data:/data/db --name ${MONGO_DB_NAME}-container mongo

# Check if the docker container is running
nc -zvv localhost 27017