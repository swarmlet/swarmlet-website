---
id: secrets-and-configs
title: Secrets and configs

---

## Managing secrets and configs with Swarmlet
Variables configured during installation will be saved using Docker configs and secrets.
What are [configs](https://docs.docker.com/engine/swarm/configs/) and [secrets](https://docs.docker.com/engine/swarm/secrets/)?
Using this approach, we can use these values in any swarm service.
Secrets can only be used by services, by injecting them in the project `docker-compose.yml` file for example.
You can use the Swarmlet user config and secrets in your project by adding the following to your project compose file.

### Secrets and configs
```yml
services:
  my-service:
    image: alpine
    command:
      - /bin/sh
      - -c
      - |
        echo "Contents of /swarmlet-config"
        cat /swarmlet-config
        echo "Contents of /run/secrets/swarmlet-user-secrets"
        cat /run/secrets/swarmlet-user-secrets
    configs:
      - swarmlet-config
    secrets:
      - swarmlet-user-secrets
    deploy:
      mode: replicated
      replicas: 1

configs:
  swarmlet-config:
    external: true

secrets:
  swarmlet-user-secrets:
    external: true
```

### Creating secrets
These are different ways of creating Docker secrets. First, log in to a manager node and create a secret using:
```bash
docker secret create my-secret "the secret"

echo "the secret value" > /home/$USER/the-secret.txt
docker secret create my-secret /home/$USER/the-secret.txt

THE_SECRET="a secret value"
echo $THE_SECRET | docker secret create my-secret -
```
Edit your project Compose file.
```yml
services:
  my-service:
    image: alpine
    command: sh -c 'cat /run/secrets/my-secret'
    secrets:
      - my-secret
    deploy:
      mode: replicated
      replicas: 1

secrets:
  my-secret:
    external: true
```
### Configs
```yml
services:
  my-service:
    image: alpine
    command: sh -c 'cat /swarmlet-config'
    configs:
      - swarmlet-config
    deploy:
      mode: replicated
      replicas: 1

configs:
  swarmlet-config:
    external: true
```
#### Creating configs
These are different ways of creating Docker configs. First, log in to a manager node and create a config using:
```bash
# Different ways of creating a Docker config
docker config create my-config "the config"

echo "the config" > /home/$USER/the-config.txt
docker secret create my-config /home/$USER/the-config.txt

THE_CONFIG="a config"
echo $THE_CONFIG | docker secret create my-config -
```
Edit your project compose file.
```yml
services:
  my-service:
    image: alpine
    command: sh -c 'cat /my-config'
    configs:
      - my-config
    deploy:
      mode: replicated
      replicas: 1

configs:
  my-config:
    external: true
```
