#!/bin/bash

set -o xtrace

docker rmi localhost/sonrisapost || true
docker build --target dist -t localhost/sonrisapost -f Dockerfile.dev .
docker build --target devcontainer -t localhost/sonrisapost-devcontainer -f Dockerfile.dev .
