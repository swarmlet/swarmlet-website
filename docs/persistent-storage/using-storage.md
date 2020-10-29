---
id: using-storage
title: Using persistant storage
keywords:
  - docs
  - persistent
  - storage
  - distributed
---

## How does it work?

When you use Docker to create application containers, you will probably need to save data to the server disk at some point. If you have an app - say a Node.js API - running in a container on a server, you can save data inside your running container. Maybe you want to receive JPEG images from another service and save these to disk, to render a GIF every night at 12 p.m.

This works just fine as long as you don't deploy a new version of the app, or if the container is removed. In that case you would lose all your saved data, because the data is stored inside the container only! Docker containers are ephemeral by definition. This means they are meant to die at some point, and should be considered stateless.

To **persist** data on the server disk, you would need to attach a volume to your container. This way, a new version of your app (running in it's own new container) can use the external volume, and the data that has been written to it by other containers is available.

## Distributed storage

Where is my data? We're running things on multiple servers after all.

Swarmlet uses GlusterFS to handle distributed storage. During installation, a new Gluster Volume is created, which is shared accross swarm nodes. Think of GlusterFS like a virtual NAS (Network-Attached Storage). The Gluster Volume is mounted at `/mnt/gfs` on swarm nodes. When adding new nodes to the swarm, Swarmlet uses Ansible to automatically replicate the Gluster Volume to the new nodes, so that the data is available even when a node leaves the swarm.
