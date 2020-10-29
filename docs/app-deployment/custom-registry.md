---
id: custom-registry
title: Custom container registry
keywords:
  - docs
  - deployment
  - deploying
  - docker
  - registry
---

## Using an external registry

Sometimes you would want to pull your Docker images from an external registry, instead of using application images stored in the swarm registry.  

Since GitHub recently announced [GitHub Container Registry](https://github.blog/2020-09-01-introducing-github-container-registry/), let's build a project using GitHub Actions and push/pull the project image(s) to/from the GitHub Container Registry. The registry is located at <https://ghcr.io>

:::note Steps

1. Create a Personal Access Token in GitHub to allow registry access
1. Add the PAT to your project repository's secrets so we can use it in the deploy action
1. Create a GitHub Action, update the project Docker Compose and entrypoint files
1. Store the registry credentials on the swarm
1. Push an update to your GitHub project repository
:::

## Project configuration

### Create GitHub Action

```yml title="./.github/workflows/deploy.yml"
name: Deploy to swarm

on:
  push:
    branches:
      - master

env:
  REMOTE_USER: git
  REMOTE_HOST: mydomain.com
  REGISTRY_HOST: ghcr.io
  APP_NAME: my-fancy-app

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set image tag
        run: echo "::set-env name=IMAGE_TAG::${{ github.repository_owner }}/${{ env.APP_NAME }}"

      - name: Build and push to container registry
        uses: docker/build-push-action@v1
        with:
          registry: ${{ env.REGISTRY_HOST }}
          username: ${{ github.actor }}
          password: ${{ secrets.CR_PAT }}
          repository: ${{ env.IMAGE_TAG }}
          tags: latest

      - name: Deploy
        run: |
          cd $GITHUB_WORKSPACE
          git fetch --unshallow
          git remote add swarm $REMOTE_USER@$REMOTE_HOST:$APP_NAME
          GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_rsa -F /dev/null -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
          git push -u swarm master --force
```

### Update the project Docker Compose file

```yml title="./docker-compose.yml"
version: '3.7'

services:
  web:
    image: ghcr.io/${REGISTRY_USERNAME}/my-fancy-app
    secrets:
      - github-registry-secrets
    networks:
      - traefik-public
    deploy:
      mode: replicated
      replicas: 1
      labels:
        - traefik.enable=true
        - traefik.http.services.my-fancy-app.loadbalancer.server.port=5000
        - traefik.http.routers.my-fancy-app.rule=Host(`my-fancy-app.mydomain.com`)
        - traefik.http.routers.my-fancy-app.entrypoints=http,https
        - traefik.http.routers.my-fancy-app.middlewares=redirect@file

secrets:
  github-registry-secrets:
    external: true

networks:
  traefik-public:
    external: true
```

### Create an entrypoint file

TODO

<!-- Create or update the `entrypoint` script in the root of your project.  
This script will make sure that the secrets are available when we try to pull artifacts from the external registry.  

Example entrypoint file:

```bash title="./entrypoint"
#!/usr/bin/env bash

if [[ ! -f "/run/secrets/github-registry-secrets" ]]; then
  echo "$PREFIX github-registry-secrets file not found, exiting."
  exit 1
else
  source "/run/secrets/github-registry-secrets"
  echo "$REGISTRY_PASSWORD" | docker login --password-stdin \
    -u "$REGISTRY_USERNAME" \
    "$REGISTRY_HOST"
fi

``` -->

### Store the registry credentials on the swarm

Create a new Docker secret on a swarm manager node.  
In this example we'll name the secret `github-registry-secrets`.

```bash
cat << EOM | docker secret create github-registry-secrets -
REGISTRY_USERNAME="<your-github-username>"
REGISTRY_PASSWORD="<your-personal-access-token>"
REGISTRY_HOST=ghcr.io
EOM
```

## Links

- [Getting started with GitHub Container Registry](https://docs.github.com/en/free-pro-team@latest/packages/getting-started-with-github-container-registry)
- [Example `deploy.yml` GitHub Action]()
