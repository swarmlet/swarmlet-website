---
id: deploying-applications
title: Deploying applications
keywords:
  - docs
  - deploying
  - apps
  - applications
---

## How to deploy apps on your swarm

- Use an existing project, or create a new project based on one of the [examples](/docs/getting-started/deploying-applications#example-application-setup)
- Add a `docker-compose.yml` file in the root of your project: [example docker-compose.yml](https://github.com/swarmlet/swarmlet/blob/master/examples/basic-example/docker-compose.yml)
- Add a git remote to your local project using `git remote add swarm git@swarm:my-app`
- Commit your files: `git add . && git commit -m 'initial'`
- Push to the swarm repository: `git push swarm master`
- Wait for Traefik to update it's configuration and visit your app at [https://my-app.mydomain.com](https://my-app.mydomain.com)

## Example app setup

### Python & Redis

This guide describes how to deploy a simple Python web server using a Redis backend on your swarm.

Create a new project locally:

```shell
# Create project folder
mkdir my-app
cd my-app

# Create files
touch app.py requirements.txt Dockerfile docker-compose.yml .env

# Initialize a local git repository and add a new remote
git init
git remote add origin git@swarm:my-app
```

Code a basic Python web server:

```python title="./app.py"
from flask import Flask
from redis import Redis
import socket

app = Flask(__name__)
redis = Redis(host='redis', port=6379)

@app.route('/')
def hello():
    count = redis.incr('hits')
    host_name = socket.gethostname()
    host_ip = socket.gethostbyname(host_name)
    return '<h1>Hello World!</h1>' \
      'I have been seen %s times<br>' \
      'HostName = %s<br>' \
      'IP = %s<br>' \
      'Try refreshing the page.' % (count, host_name, host_ip)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
```

Add the application dependencies:

```txt title="./requirements.txt"
flask
redis
```

Describe the build steps in a `Dockerfile`:

```Dockerfile title="./Dockerfile"
FROM python:3.4-alpine
ADD . /code
WORKDIR /code
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```

Describe the application stack in a `docker-compose.yml` file including the desired hostname for the frontend service and internal container port to expose:

```yml title="./docker-compose.yml"
version: "3.7"

services:
  frontend:
    image: ${SWARMLET_REGISTRY}/my-app
    build: .
    networks:
      - traefik-public
      - my-app-private-network
    deploy:
      mode: replicated
      replicas: 1
      labels:
        - traefik.enable=true
        - traefik.http.services.my-app.loadbalancer.server.port=8000
        - traefik.http.routers.my-app.rule=Host(`my-app.${DOMAIN}`)
        - traefik.http.routers.my-app.entrypoints=http,https
        - traefik.http.routers.my-app.middlewares=redirect@file

  redis:
    image: redis:alpine
    networks:
      - my-app-private-network

networks:
  my-app-private-network:
  traefik-public:
    external: true
```

Define environment variables in a `.env` file:

```shell title="./.env"
DOMAIN=mydomain.com
```

:::note secrets and configs
Never store sensitive data hardcoded in environment variables like this.  
\> [Read more about secrets and configs here](/docs/getting-started/secrets-and-configs)
:::

Create a new commit and deploy the application to the swarm using `git push`:

```shell
git add .
git commit -m 'initial'
git push origin master
```

Wait for Traefik to update it's configuration and visit your app at <https://my-app.mydomain.com>!

---

### Static site

This guide describes how to deploy a static site on your swarm.  

Create a new project locally:

```shell
# Create project folder
mkdir my-site
cd my-site

# Create files/folders
mkdir public
touch Dockerfile docker-compose.yml nginx.default.conf public/index.html

# Initialize a local git repository and add a new remote
git init
git remote add origin git@swarm:my-site
```

Code a basic web page`:

```html title="./public/index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="title">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My static site</title>
  </head>
  <body>
    <h1>Hello Swarmlet!</h1>
  </body>
</html>
```

Add a basic NGINX configuration:

```nginx title="./nginx.default.conf"
server {
  listen 5000;
  server_name localhost;

  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}
```

Describe the build steps in a `Dockerfile`:

```Dockerfile title="./Dockerfile"
FROM nginx:alpine

COPY ./public /usr/share/nginx/html
COPY ./nginx.default.conf /etc/nginx/conf.d/default.conf

EXPOSE 5000
```

Describe the application stack in a `docker-compose.yml` file including the desired hostname for the frontend service and internal container port to expose:

```yml title="./docker-compose.yml"
version: "3.7"

services:
  frontend:
    image: ${SWARMLET_REGISTRY}/my-site
    build: .
    deploy:
      replicas: 3
      labels:
        - traefik.enable=true
        - traefik.http.services.my-site.loadbalancer.server.port=5000
        - traefik.http.routers.my-site.rule=Host(`my-site.mydomain.com`)
        - traefik.http.routers.my-site.entrypoints=http,https
        - traefik.http.routers.my-site.middlewares=redirect@file
    networks:
      - traefik-public

networks:
  traefik-public:
    external: true
```

Create a new commit and deploy the application to the swarm using `git push`:

```shell
git add .
git commit -m 'initial'
git push origin master
```

Wait for Traefik to update it's configuration and visit your app at <https://my-site.mydomain.com>!
