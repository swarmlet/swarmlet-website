---
id: introduction
title: Introduction
sidebar_label: Introduction
---

## What is Swarmlet?

Swarmlet is a self-hosted, open-source Platform as a Service that runs on any single server.  
It's mainly intended for use with multiple servers, a server cluster / swarm.  
Heavily inspired by **[Dokku](http://dokku.viewdocs.io/dokku/)**.

:::note Simply put
It's a piece of software that you can install on a server to host apps with ease.  
Swarmlet handles the initial server configuration, and makes sure apps keep running.  

Deploy or update an app by simply `git push`-ing your app to your newly created server.  
Add additional nodes (servers) to the swarm (server cluster) to provide more resources for your apps.  
Use the `swarmlet` command to perform common tasks on the server.  

\> [More on how Swarmlet works](/docs/app-deployment/deploying-apps)
:::


Swarmlet is a thin wrapper around [Docker Compose](https://docs.docker.com/compose/) and [Docker Swarm mode](https://docs.docker.com/engine/swarm/).  
A few core services, [Traefik](https://github.com/containous/traefik) (v2.3), [Let's Encrypt](https://letsencrypt.org), [Ansible](https://www.ansible.com/) and [GlusterFS](https://www.gluster.org/) are included by default.  
These enable automatic SSL, load balancing, swarm state management and distributed file storage.  
Let's Encrypt wildcard certificates support - [more info](https://doc.traefik.io/traefik/https/acme/#wildcard-domains).  

During the installation you can choose to install [Matamo](https://matomo.org/), [Portainer](https://www.portainer.io/), [Swarmpit](https://swarmpit.io) and [Swarmprom](https://github.com/stefanprodan/swarmprom).  
These optional services are included to provide analytics and various metrics dashboards.

This project is aimed at developers that want to experiment with application deployment in a flexible multi-server / high-availability environment. The goal is to be able to set up your own swarm and deploy your app(s) in minutes.

- The project GitHub repository can be found at [github.com/swarmlet/swarmlet](https://github.com/swarmlet/swarmlet)
- The Swarmlet project boards are located at [github.com/orgs/swarmlet/projects](https://github.com/orgs/swarmlet/projects)
- Join the discussion on Slack using [this invite link](https://join.slack.com/t/swarmlet/shared_invite/zt-eki9qa53-9FdvUik604rncp61dbawkQ)

### Demo

export const DemoVideo = () => {
return (
<div
style={{
        padding: "62.5% 0 0 0",
        position: "relative",
        marginBottom: "25px",
      }}>
<iframe
src="https://player.vimeo.com/video/412918465?title=0&byline=0&portrait=0"
style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
frameBorder="0"
allow="autoplay; fullscreen"
allowFullScreen >
</iframe>
</div>
)
}

<DemoVideo />

## Motivation

Imagine you want to host multiple applications, websites, API services, databases and workers on your VPS (Virtual Private Server). [Docker](https://www.docker.com/101-tutorial) makes it possible to wrap each application in it's own container so it can be deployed anywhere. A tool like [Dokku](http://dokku.viewdocs.io/dokku/) does a very good job at managing and building these containers on a VPS and having multiple web applications running on the same server. Dokku can manage virtual hosts, enable SSL using Let's Encrypt, handle environment variable injection, etc. And most importantly, Dokku makes it possible to deploy apps to your server with a simple `git push`.  
Quite amazing.

Now there comes a time when we have 25+ applications running on our single host. Disk space starts becoming an issue, anxiety intensifies about the server going down, you wake up in the middle of the night mumbling _"Ephemeral Application Container Orchestration and Continuous Delivery on Highly-Available Server Clusters"_ and the creeping thought of running a personal server cluster seems to be growing stronger by the day.

> _"But what about resource allocation in a distributed system?"_  
> _"And which server is running my application container?"_  
> _"What happens when a server running my website container crashes?"_  
> _"Where will my SSL certificates be stored in a swarm with 3 nodes?"_

Questions, doubt.. We could just ramp up the server resources a.k.a. [scaling vertically](https://stackoverflow.com/questions/11707879/difference-between-scaling-horizontally-and-vertically-for-databases). Adding more processing power, disk space or increasing memory. _(downtime..)_ - However, the itching thought of running a multi server setup just feels like the right thing to do. Ok, so what are the options? Everyone is talking about [Kubernetes](https://learnk8s.io/troubleshooting-deployments), a bit much to start with maybe. The [k3s](https://k3s.io/) project looks interesting but since it's based on Kubernetes the learning curve is still quite steep.

Since we're using `Dockerfile`'s and `docker-compose.yml` files in our projects already, let's try to stay close to Docker. It would be nice to stay _very_ close to Docker for maximal compatibility. It would also be nice to be able to define our entire application stack, including domains, deployment strategies, networking and persistent storage for our ephemeral / stateless applications in a single file. Also we want to be able to `git push` our local project repository to our cluster to deploy **and** have SSL certificates issued automatically for our web facing services. You're probably using Docker Compose already, so let's combine Git, Docker Swarm mode and Docker Compose to deploy applications to a flexible _(cheap)_ personal server cluster.

## Getting started

1. Install Swarmlet on a new VPS running Ubuntu 18.04 x64 as root.
1. [Edit your local SSH config](/docs/getting-started/ssh-key-setup) to use `ssh swarm` instead of `ssh root@123.23.12.123`
1. Use an existing project, or clone one of the [examples](/docs/examples/static-site)
1. Add a [`docker-compose.yml`](/docs/getting-started/deploying-applications) file in the root of your project
1. Add a git remote: [`git remote add swarm git@swarm:my-project`](/docs/getting-started/ssh-key-setup)  
1. Deploy your application stack to the swarm using `git push swarm master`

**[Example application setup and deployment guide](/docs/getting-started/deploying-applications#example-application-setup)**

## Installation

#### [Full installation instructions can be found here](/docs/getting-started/installation)  

:::note Configure a domain
Make sure you have a (sub) domain available which is pointed to your server, this is necessary to access the Traefik or Portainer/Matomo dashboards located at e.g. `portainer.your-domain.com`.  

You can use `dig` if you're unsure if your domain points to the right IP address or DNS has updated yet.
From your local machine, run:
```shell
dig +short your-domain.com
```
:::

### Quick interactive installation

To install the latest version of Swarmlet, log in to your server as root and run:

```shell
curl -fsSL https://get.swarmlet.dev | bash
```

The installation should take a few minutes to complete.

### Custom installation [(options)](https://swarmlet.dev/docs/getting-started/installation)

```shell
# Headless (noninteractive) installation:
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

## Examples

Swarmlet includes various examples of services that you can deploy to your server cluster with a simple `git push`.

- [swarmlet-website - The swarmlet.dev website](https://github.com/swarmlet/swarmlet-website)
- [get-swarmlet - The get.swarmlet.dev install script](/docs/examples/get-swarmlet)
- [Basic example - Static site](/docs/examples/static-site)
- [Basic example - Python web server + Redis](/docs/examples/python-redis)
- [Moderate example - NGINX + React app + Node.js API](/docs/examples/nginx-react-node)
- (FIX) [Advanced example - NGINX + React app + Node.js API + CMS + staging/production](/docs/examples/nginx-react-node-cms)
- (FIX) [GitLab CE](/docs/examples/gitlab-ce) (self-hosted)
- (FIX) [GitLab Runner](/docs/examples/gitlab-runner) (self-hosted)
