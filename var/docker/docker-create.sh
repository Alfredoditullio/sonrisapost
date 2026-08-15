#!/usr/bin/env bash

docker kill sonrisapost || true 
docker rm sonrisapost || true 
docker create --name sonrisapost -p 3000:3000 -p 4200:4200 localhost/sonrisapost
