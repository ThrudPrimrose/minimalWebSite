#!/bin/bash

source ../.env

docker build -t minimal-website-app .

docker run -p ${NODE_APP_PORT}:${NODE_APP_PORT} -d minimal-website-app