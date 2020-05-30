---
id: secrets-and-configs
title: Secrets and configs

---

## Managing secrets and configs with Swarmlet
Variables configured during installation will be stored in Docker [configs](https://docs.docker.com/engine/swarm/configs/) and [secrets](https://docs.docker.com/engine/swarm/secrets/). This enables usage of secret values in swarm services. Include secrets and/or configs in the project `docker-compose.yml` file to access them in your services. Secrets can be used by swarm services only. 
- Configs are mounted at `/config-name` in the service container.
- Secrets are mounted at `/run/secrets/secret-name`.

## Secrets and configs
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
Log into a manager node and use `docker secret create` to create a new config.
```bash
echo "the secret value" > /home/$USER/the-secret.txt
docker secret create my-secret /home/$USER/the-secret.txt

THE_SECRET="a secret value"
echo $THE_SECRET | docker secret create my-secret -
```
Example compose file:
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

## Configs
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
### Creating configs
Log into a manager node and use `docker config create` to create a new config.
```bash
echo "the config" > /home/$USER/the-config.txt
docker config create my-config /home/$USER/the-config.txt

THE_CONFIG="a config"
echo $THE_CONFIG | docker config create my-config -
```
Example compose file:
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
