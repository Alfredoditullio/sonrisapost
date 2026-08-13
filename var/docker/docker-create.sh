#!/usr/bin/env bash

docker kill dentalcore || true 
docker rm dentalcore || true 
docker create --name dentalcore -p 3000:3000 -p 4200:4200 localhost/dentalcore
