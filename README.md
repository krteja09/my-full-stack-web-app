# my-full-stack-web-app using React, Go, Docker
Use a single Dockerfile to spin up a ReactJS client, and a Go server.

# Usage

# create the image
docker build -t web-api .

# run a container
docker run --detach --name full-stack -p 3000:8080 -d web-api


# remove container
docker container stop full-stack
docker container rm full-stack

# delete the image
docker rmi web-api
