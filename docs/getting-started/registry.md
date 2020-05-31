---
id: registry
title: Registry

---

## How does it work?
Swarmlet relies on a few core modules to function properly, one of which is the internal registry. The registry is deployed as a swarm service, which means we can login using `docker login localhost:5000` from within the swarm. Services containing a `build` step can store their images in the swarm registry by using the `${SWARMLET_REGISTRY}` environment variable, which is injected by the deployer service before deployment.  

A very simple service could look like this. The deployer service will build the `Dockerfile` and push the artifacts to the internal registry if `image: ${SWARMLET_REGISTRY}/app-image-name` is used. By using `${SWARMLET_REGISTRY}/my-app`, an image named `my-app` will be built, pushed and stored in the swarm registry. This enables automatic caching of build artifacts.
```yml
version: '3.7'

services:
  my-app:
    build: .
    image: ${SWARMLET_REGISTRY}/my-app
    deploy:
      mode: replicated
      replicas: 1
```
### Exposing the registry
Follow these steps to expose the registry on https://registry.yourdomain.com.
**[TODO]**: deploy registry automatically after installation

```bash
# Assuming Swarmlet is installed
# Clone the registry repository to a local folder

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
