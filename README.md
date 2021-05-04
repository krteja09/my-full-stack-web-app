## my-full-stack-web-app using React, Go, Docker
Use a single Dockerfile to spin up a ReactJS client, and a Go server.

# Usage
`cd my-full-stack-web-app-main`

Create the image
### `docker build -t web-api .` 

Run a container
### `docker run --detach --name full-stack -p 3000:8080 -d web-api`

Run the app
### open `http://localhost:3000`


Remove container
### `docker container stop full-stack`
### `docker container rm full-stack`

Delete the image
### `docker rmi web-api`
