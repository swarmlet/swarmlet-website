---
id: automatic-ssl-and-load-balancing
title: Automatic SSL and load balancing
sidebar_label: Automatic SSL and load balancing
keywords:
  - docs
  - ssl
  - load-balancing
---

## Introduction

Because Swarmlet activates Docker Swarm mode, you can run your applications in 'highly available' Docker containers across your swarm. The application containers will be distributed on the swarm, this can be configured in your project `docker-compose.yml` file under the `deploy` key.

### Traefik and GlusterFS

![traefik diagram](/img/traefik-diagram.png)

Swarmlet uses [Traefik](https://github.com/containous/traefik) for load balancing. Traefik detects new applications and listens for any configuration updates. Traefik will attempt to generate a SSL certificate for each frontend service in your application stack using [Let's Encrypt](https://letsencrypt.org).

Certificates are stored on a GlusterFS volume, mounted at `/mnt/gfs`. In the case where a swarm node goes offline, the certificates are still available on other nodes in the GlusterFS pool.

:::note Let's encrypt rate limiting
Use the Let's Encrypt [staging environment](https://letsencrypt.org/docs/staging-environment/) to prevent exceeding the [rate limit](https://letsencrypt.org/docs/rate-limits/) while developing.  
To change to the staging/production server, update the [Traefik configuration](#traefik-configuration).
:::

## Configuration

### Example project configuration

Add a `.env` file to the root of your project, containing:

```shell title="./.env"
DOMAIN=mydomain.com
```

To enable load balancing on a service and expose it to the web, add the highlighted labels and networks to your frontend service(s):

```yml {8-25} title="./docker-compose.yml"
version: "3.7"

services:
  web:
    image: ${SWARMLET_REGISTRY}/test-app
    build: .
    deploy:
      mode: replicated
      replicas: 3
      labels:
        - traefik.enable=true
        # Specify the internal container port to expose
        - traefik.http.services.test-app.loadbalancer.server.port=8000
        # Specify the domain
        - traefik.http.routers.test-app.rule=Host(`test-app.${DOMAIN}`)
        # Redirect HTTP traffic to HTTPS
        - traefik.http.routers.test-app.entrypoints=http,https
        - traefik.http.routers.test-app.middlewares=redirect@file
    networks:
      - traefik-public

networks:
  traefik-public:
    external: true
```

### Traefik configuration

Pull the `router` repo from the swarm:

```shell
git clone git@my-swarm:router
cd router
```

Uncomment the following line in the `docker-compose.yml` file.

```yml
# - --certificatesresolvers.letsencrypt.acme.caserver="https://acme-staging-v02.api.letsencrypt.org/directory"
```

Save and commit your changes.  
Push to re-deploy Traefik with it's new settings:

```shell
git push origin master
```
