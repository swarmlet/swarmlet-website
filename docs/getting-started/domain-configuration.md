---
id: domain-configuration
title: Domain configuration
keywords:
  - docs
  - domain
  - domains
  - configuration
---

## Getting started

Add a `label` under the `deploy` key in your project compose file to expose your service on the desired domain. Traefik will pick up any changes to updating services so whenever you redeploy, Traefik will try to create SSL certificates using Let's Encrypt if they don't exist already.

:::note Environment variables
You can use environment variables in you Compose files.  
Place a `.env` file next to the `docker-compose.yml` project file to use the environment variables.  
Or update the `swarmlet-user-config` Docker Config so that the deployer service can access the variable during builds.
:::

### Example project compose file

```bash title="./.env"
THE_DOMAIN=my-website.com
```

```yml {15} title="./docker-compose.yml"
version: "3.7"

services:
  frontend:
    build: .
    image: ${SWARMLET_REGISTRY}/my-website-frontend
    networks:
      - traefik-public
    deploy:
      mode: replicated
      replicas: 1
      labels:
        - traefik.enable=true
        - traefik.http.services.my-website.loadbalancer.server.port=5000
        - traefik.http.routers.my-website.rule=Host(`${THE_DOMAIN}`)
        - traefik.http.routers.my-website.entrypoints=http,https
        - traefik.http.routers.my-website.middlewares=redirect@file

networks:
  traefik-public:
    external: true
```

## Updating a domain

Maybe you want to host the registry on a different domain, instead of the default `registry.${ROOT_DOMAIN}`. To update any module, simply `git pull` the modules' repository, edit the configuration, commit and push to redeploy. Another option would be to use a service like Swarmpit or Portainer to redeploy using a web interface.

Example: Changing the exposed internal registry URL to https://custom-registry.my-domain.com

```bash
git clone git@swarm:registry
cd registry

### edit '.env' and 'docker-compose.yml'

git add . && git commit -m 'update'
git push origin master

# $ ...
# $ remote:  Stack deployed:
# $ remote: [registry] — https://custom-registry.my-domain.com
```

Try it out:

```bash
docker login custom-registry.my-domain.com
$ Username: <provide username configured during installation>
$ Password: <provide password configured during installation>
$ Login Succeeded
```
