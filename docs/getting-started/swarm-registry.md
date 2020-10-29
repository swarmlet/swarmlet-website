---
id: swarm-registry
title: Swarm registry
keywords:
  - docs
  - docker
  - registry
---

## How does it work?

Swarmlet relies on a few core modules to function properly, one of which is the internal registry. The registry is deployed as a swarm service, which means we can login from within the swarm using:

```bash
docker login localhost:5000
$ Username: <provide username configured during installation>
$ Password: <provide password configured during installation>
$ Login Succeeded

# Get the registry catalog
curl --user username:password  http://localhost:5000/v2/_catalog
```

Services containing a `build` step can store their images in the swarm registry by using the `${SWARMLET_REGISTRY}` environment variable, which is injected by the deployer service before building and deploying the service.

:::note Environment variables
You can use all environment variables used by Swarmlet, including the installation configuration variables such as `$ROOT_DOMAIN` or `$SWARMLET_USERNAME` in your project `.env` and `entrypoint` files, these will be sourced from the project root directory before deployment as well.

- List of [Swarmlet environment variables](https://github.com/swarmlet/swarmlet/blob/master/src/constants).
- List of [user environment variables](https://github.com/swarmlet/swarmlet/blob/master/install#L32-L43).

:::

## Using the registry

A very simple service with a Dockerfile which image we want to store in the registry could look like this. The Swarmlet `deployer_agent` service will build the `Dockerfile` located in the project repository and push the artifacts to the internal registry if `image: ${SWARMLET_REGISTRY}/app-image-name` is used.

By using `${SWARMLET_REGISTRY}/my-app`, an image named `my-app` will be built, pushed and stored in the swarm registry. This enables automatic caching of build artifacts.

```yml title="./docker-compose.yml"
version: "3.7"

services:
  my-app:
    build: .
    image: ${SWARMLET_REGISTRY}/my-app
    deploy:
      mode: replicated
      replicas: 1
```

## Exposing the registry

After installation, the registry is exposed by default. Log in using the username and password you've provided during installation.
Try logging into the registry using:

```
docker login registry.yourdomain.com
$ Username: <provide username configured during installation>
$ Password: <provide password configured during installation>
$ Login Succeeded
```

### Exposing the registry on a different domain

```bash
git clone git@swarm:registry
cd registry
echo DOMAIN=yourdomain.com > .env
git add . && commit -m 'update'
git push origin master

# Wait a few moments for Traefik to update it's configuration

docker login registry.yourdomain.com
$ Username: <provide username configured during installation>
$ Password: <provide password configured during installation>
$ Login Succeeded
```
