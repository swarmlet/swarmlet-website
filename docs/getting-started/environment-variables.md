---
id: environment-variables
title: Environment variables
keywords:
  - docs
  - environment
  - variables
  - vars
---

## Using environment variables

There are several ways to use environment variables (env vars) in your apps.

- Hardcoded environment variables in your project compose file, using the `env` or `args` keywords.  
  More on [environment variables](https://docs.docker.com/compose/environment-variables/) and [build arguments](https://docs.docker.com/compose/compose-file/#args).
- Passing external environment variables to a compose file, using the `${MY_ENV_VAR}` syntax in your `docker-compose.yml` file.
- Doing this manually or with a custom script by adding optional `.env` and `entrypoint` files in the root of the project.  
  See [this example](https://github.com/swarmlet/swarmlet/tree/master/examples/nginx-react-node-api) on how to pass environment variables from a `.env` file to a service in the compose file, which in turn injects them into the Docker container.

### Environment variables in builds

You can create a `.env` and/or `entrypoint` file in the root of your project.  
These files will be sourced by the Swarmlet `deployer_agent` service before building and deploying an app.

Print out all the current environment variables used by `deployer_agent`:

```bash
ENV=$(docker container exec $(docker ps --filter name=deployer_agent -q) /entrypoint printenv) && echo "${ENV%%BASH_FUNC*}"
```

## Adding environment variables to your apps

Use Docker [configs](https://docs.docker.com/engine/swarm/configs/) and [secrets](https://docs.docker.com/engine/swarm/secrets/) to store different types of environment variables in your swarm.
See the Swarmlet [Secrets and configs](/docs/getting-started/secrets-and-configs) documentation section.
Secrets and configs can be added to services by specifying them in - you guessed it - the project `docker-compose.yml` file.

```bash
# On a swarm manager node
MY_CONF="ALTERNATIVE_HOSTNAME=SwarmletJohansson"
echo $MY_CONF | docker config create my-config -
```

```yml title="./docker-compose.yml"
version: "3.7"

services:
  my-service:
    image: alpine
    command: sh -c 'echo "Contents of /my-config:"; cat /my-config'
    ### Or:
    # command: sh -c 'set -o allexport; source /my-config; printenv'
    configs:
      - my-config
    deploy:
      mode: replicated
      replicas: 1

configs:
  my-config:
    external: true
```

Deploy the stack, either create a local project and push (as described [here](/docs/getting-started/deploying-applications)), or copy-paste the above snippet to the server and run:

```bash
docker stack deploy --compose-file docker-compose.yml env-vars
docker service logs env-vars_my-service -f
```
