#!/bin/bash

set -o xtrace

docker rmi localhost/dentalcore || true
docker build --target dist -t localhost/dentalcore -f Dockerfile.dev .
docker build --target devcontainer -t localhost/dentalcore-devcontainer -f Dockerfile.dev .
