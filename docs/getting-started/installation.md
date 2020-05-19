---
id: installation
title: Installation

---

## Installing Swarmlet on a server
**Requirements**: Bash 4.0 or higher (run `bash --version`)  
> *Recommended distribution: Ubuntu 18.04 x64*  

### Quick installation
To install the latest version of Swarmlet, log in to your server as root and run:  
```shell
curl -fsSL https://get.swarmlet.dev | bash -s ROOT_DOMAIN=mydomain.com
```

### Custom installation
```shell
curl -fsSL https://get.swarmlet.dev | bash -s \
  INSTALL_ZSH=true \
  CREATE_SWAP=true \
  ROOT_DOMAIN=dev.mydomain.com

# Install a different branch:
BRANCH=develop
curl -fsSL https://raw.githubusercontent.com/swarmlet/swarmlet/$BRANCH/install | bash -s \
  INSTALL_BRANCH=$BRANCH \
  ROOT_DOMAIN=dev.mydomain.com
```
### Installation options
```shell
ROOT_DOMAIN=$HOSTNAME       # (default $HOSTNAME) The domain to use for deployment of included services
INSTALLATION_MODE=full      # (default full, options: full|minimal|bare) .. TODO
INSTALL_BRANCH=master       # (default master) The default branch to install
CREATE_SWAP=false           # (default false) Allocate 1GB of swap space
INSTALL_ZSH=false           # (default false) Install 'Oh My Zsh'
NOOP=                       # no-op for testing purposes
# > TODO/FIX:
# DEBUG=                    # (default undefined) Run installation in debug mode
# INTERACTIVE=false         # (default false) Use CLI wizard to setup Swarmlet
```

The installation takes a few minutes to complete.  
Check if services are running:
```shell
docker stack ls
docker service ls
```
