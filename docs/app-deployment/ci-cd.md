---
id: ci-cd
title: CI/CD pipelines
keywords:
  - docs
  - deployment
  - deploying
  - labels
  - github
  - bitbucket
  - gitlab
  - actions
  - ci/cd
  - pipelines
---

## Using pipelines to deploy apps

### GitHub Actions

Create a new file `deploy.yml` in the `.github/workflows` directory in the root of your project.  

```yml title="./.github/workflows/deploy.yml"
name: Deploy

on:
  push:
    branches:
      - develop
      - master

env:
  SWARMLET_USER: git
  SWARMLET_HOST: mydomain.com
  SWARMLET_APP_NAME: my-app

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set environment
        run: echo "::set-env name=BRANCH::$(echo ${GITHUB_REF##*/})"

      - name: Set app name [staging]
        if: env.BRANCH == 'develop'
        run: echo "::set-env name=SWARMLET_APP_NAME::$SWARMLET_APP_NAME-staging"

      - name: Install SSH key
        uses: shimataro/ssh-key-action@v1
        with:
          private-key: ${{ secrets.SSH_PRIVATE_KEY }}
          known-hosts: ${{ env.SWARMLET_HOST }}

      - name: Deploy to swarm
        run: |
          cd $GITHUB_WORKSPACE
          git fetch --unshallow
          git remote add swarm $SWARMLET_USER@$SWARMLET_HOST:$SWARMLET_APP_NAME
          GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_rsa -F /dev/null -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
          git push -u swarm $BRANCH:master --force

      - name: Slack notify
        uses: rtCamp/action-slack-notify@v2.0.2
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
          SLACK_TITLE: "${{ env.SWARMLET_APP_NAME }} deployed:"
          SLACK_USERNAME: Swarmlet
          SLACK_ICON_EMOJI: ":fish:"

```

### GitLab CI

Create a new file `.gitlab-ci.yml` in the root of your project.  

```yml title="./.gitlab-ci.yml"
image: node:14

cache:
  paths:
    - node_modules/

variables:
  SWARMLET_USER: git
  SWARMLET_HOST: mydomain.com
  SWARMLET_APP_NAME: my-app

stages:
  - deployment

swarm:
  stage: deployment
  environment:
    name: production
    url: https://${SWARMLET_APP_NAME}.${SWARMLET_HOST}/
  script:
    - mkdir -p ~/.ssh
    - echo "${SSH_PRIVATE_KEY}" | tr -d '\r' > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config
    - ssh-keyscan -H ${SWARMLET_HOST} >> ~/.ssh/known_hosts
    - git fetch --unshallow
    - git remote add swarm $SWARMLET_USER@$SWARMLET_HOST:$SWARMLET_APP_NAME
    - GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_rsa -F /dev/null -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
    - git push -u swarm $BRANCH:master --force
  only:
    - master
```

### Bitbucket Pipelines

Create a new file `bitbucket-pipelines.yml` in the root of your project.  

```yml title="./bitbucket-pipelines.yml"
image: node:12

clone:
  depth: full

pipelines:
  branches:
    master:
      - step:
          deployment: production
          script:
            - npm set progress=false
            - npm install --only-production
            - npm run build
    develop:
      - step:
          deployment: staging
          script:
            - npm set progress=false
            - npm install --only-production
            - npm run build
```
