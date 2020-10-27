---
id: deploying-apps
title: Deploying apps
---

:::note
- [https://doc.traefik.io/traefik/providers/docker/](https://doc.traefik.io/traefik/providers/docker/)
:::

## How Swarmlet handles deployments

You can `git push` to any swarm manager node to create or update a repository and deploy your application on the swarm. Swarmlet creates a `git` user on the swarm node during installation and creates the `/var/repo` directory, which will contain the bare repositories for every application you deploy to the server using Swarmlet. If a repository does not exist, it will be created by a `pre-receive` git hook.

After receiving the repository, the `post-receive` hook will execute, which triggers the `deployments` service. The `deployments` service searches for the (optional) `.env` and `entrypoint` files and the project `docker-compose.yml` file, which must be placed in the root of the project. It will build the project using `docker-compose build`, push it to the specified registry and deploy the stack using `docker stack deploy`.

If you're deploying a project with a `Dockerfile` build step without registry, use the built-in Swarmlet registry. In the `docker-compose.yml` file, add:

```yml {3}
services:
  basic-example:
    image: ${SWARMLET_REGISTRY}/basic-example
    build: .
```

The `SWARMLET_REGISTRY` environment variable is available in every build and translates to `127.0.0.1:5000/v2`, this is the internal swarm registry address.

## Deployments with Swarmlet

After receiving the new or updated repository from a user `git push`, `swarmlet` will run these steps in following order:

- Receive updated repository triggers the `/var/repo/my-app.git/hooks/post-receive` hook
- Clone or the repository contents from `/var/repo/my-app.git` to `/home/git/my-app` and set folder permissions
- Run the `deployments` service, this is a service used by Swarmlet to handle application deployments.
  - Look for optional `.env` and `entrypoint` files and load/execute them to set up environment variables and/or run scripts before actual deployment
  - Run `docker-compose build --parallel` to build the stack (if a service uses a `Dockerfile`)
  - Run `docker-compose push` to push images to the specified registry. Swarmlet uses a local registry to store Docker images, use `${SWARMLET_REGISTRY}` to store your image to the local registry.
  - Run `docker stack deploy --compose-file $COMPOSE_FILE $REPO_NAME` to deploy the application stack to the swarm
