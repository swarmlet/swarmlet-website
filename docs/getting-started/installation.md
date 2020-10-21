---
id: installation
title: Installation
---

## Installing Swarmlet on a server

> **Recommended distribution: Ubuntu 18.04 x64**
>
> Tested only on Ubuntu 18.04 x64.  
> Please create a PR if you have got it working on your system!  
> Or propose to [edit this page](https://github.com/swarmlet/swarmlet-website/edit/master/docs/getting-started/installation.md) to add your OS to the list of supported systems.  
> Thanks!

- **Requirements**: Bash 4.0 or higher (run `bash --version`)

### Quick interactive installation

Make sure you have a (sub) domain available which is pointed to your server, this is necessary to access the included dashboards such as Swarmpit or Matomo.
To install the latest version of Swarmlet, log in to your server as root and run:

```shell
curl -fsSL https://get.swarmlet.dev | bash
```

The installation should take a few minutes to complete.

### Headless / noninteractive installation

```shell
curl -fsSL https://get.swarmlet.dev | bash -s \
  INSTALLATION_TYPE=noninteractive \
  INSTALL_ZSH=true \
  CREATE_SWAP=true \
  INSTALL_MODULES="matomo swarmpit" \
  NEW_HOSTNAME=swarm-manager-1 \
  SWARMLET_USERNAME=admin \
  SWARMLET_PASSWORD=nicepassword \
  ROOT_DOMAIN=dev.mydomain.com
```

### Install from a fork or branch

```shell
GITHUB_USER=swarmlet
INSTALL_BRANCH=develop

curl -fsSL \
  https://raw.githubusercontent.com/$GITHUB_USER/swarmlet/$INSTALL_BRANCH/install |\
  bash -s INSTALL_BRANCH=$INSTALL_BRANCH
```

## Installation options

```shell
INSTALLATION_TYPE=interactive  # (default interactive, options: interactive|noninteractive) Use CLI wizard to setup Swarmlet
INSTALL_BRANCH=master          # (default master) The default branch to install
SWARMLET_USERNAME=$USER        # (default $USER) Used for authentication with the registry and web services / dashboards
SWARMLET_PASSWORD=swarmlet     # (default swarmlet) Used for authentication with the registry and web services / dashboards
SSH_AUTHORIZED_KEYS=$HOME/.ssh/authorized_keys # (default $HOME/.ssh/) The authorized SSH keys for git deployments
NEW_HOSTNAME=$HOSTNAME         # (default $HOSTNAME) Optional: set a new hostname
ROOT_DOMAIN=                   # (default undefined) The domain to use for deployment of included services
INSTALL_MODULES=               # (default undefined, options: matomo|swarmpit|swarmprom|portainer) Seperate by space and wrap in quotes to install multiple modules
CREATE_SWAP=false              # (default false) Allocate 1GB of swap space
INSTALL_ZSH=false              # (default false) Install 'Oh My Zsh'
```
