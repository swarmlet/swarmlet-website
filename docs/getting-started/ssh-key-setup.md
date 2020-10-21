---
id: ssh-key-setup
title: SSH key setup
---

## Setting up SSH keys
If you don't already have a private SSH key, typically located at `~/.ssh/id_rsa`, you will need to create one. Fortunately, this is an easy task.  

Optionally, you can create a SSH key specifically for use with the swarm, next to your other SSH key(s).

```shell
# Create a new SSH key
ssh-keygen -f ~/.ssh/id_rsa_swarm -t rsa -N '' -C "your@email.com"

# Copy key to server
ssh-copy-id -i ~/.ssh/id_rsa_swarm root@123.23.12.123
```

## Edit your local SSH config file

Assuming you've already added your SSH public key to `/root/.ssh/authorized_keys` on your server, consider adding a `Host` entry to your local `~/.ssh/config` file to make things easier:

```yaml
Host *
    Port 22
    UseKeychain yes

# ...

Host swarm
    HostName 123.23.12.123
    User root
    # The next line is optional, it defaults to ~/.ssh/id_rsa
    IdentityFile ~/.ssh/id_rsa_swarm
```

:::tip Shorthand
Now `ssh root@123.23.12.123` becomes `ssh swarm`  
This shorthand makes it easy to connect or reference your server in projects.  
:::

## Adding a git remote

In order to push and deploy apps to the swarm, we need to add a git remote to our project repository.  
Swarmlet creates a user named 'git' on the server, this user handles incoming changes.  
When specifying a remote, the remote user **must** be 'git'. And because we've updated our `~/.ssh/config` file, we can specify the host by it's name, 'swarm' in this example.  
If the project doesn't exist already, a new repo will be created on the swarm named `<project-name>`.

Adding a git remote in a project that points to your server is as easy as running:
```shell
# Syntax:
git remote add <name> <user>@<host>:<project-name>

# Example:
git remote add swarm git@swarm:my-app
```


Now you can deploy an app simply by running `git push swarm master`  
Pretty easy to remember!
