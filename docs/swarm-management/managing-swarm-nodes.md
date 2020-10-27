---
id: managing-swarm-nodes
title: Managing swarm nodes

---

## Add or remove a swarm node
`swarmlet node join <role>`
```shell
swarmlet join manager
```
Output:
```
To add a manager to this swarm, run the following command on the target node:

    curl -fsSL http://188.166.106.7:42681/join/0dd9c2a3a8c54d29 | bash

Waiting for remote..
```
