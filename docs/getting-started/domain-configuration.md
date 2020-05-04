---
id: domain-configuration
title: Domain configuration

---

## Getting started

To access an included service like Swarmpit, clone it's repository from the swarm, edit the `.env` file and deploy the application again with a `git push`.  
See how configure `~/.ssh/config` to be able to use `git@swarm:app-name` instead of `git@123.123.123.123:app-name` on the [SSH key setup page](/docs/getting-started/ssh-key-setup).
```bash
# from you local machine
git clone git@swarm:swarmpit
cd swarmpit
nano .env  # change DOMAIN=${1:-$HOSTNAME} to DOMAIN=yourdomain.com
git add . && git commit -m 'update'
git push origin master
```

<!-- Prerequisites:  
- Server with FQDN set – Can be on DNS or /etc/hosts

Step 2: Set up Custom Domain (Optional)
Dokku is your own personal Heroku. If you are familiar with Heroku you know that it runs apps on the domain herokuapp.com. So if you deploy an app called hello it will be accessible at hello.herokuapp.com.

When you set up dokku, you can create your own app domain.

In your DNS settings create the following two A records.

apps.yourdomain.com    ip of the droplet  
*.apps.yourdomain.com  ip of the droplet
This means that if you deploy an app called hello it will be accessible at hello.apps.yourdomain.com. Of course, you can customize this and skip the apps subdomain if you wish.

Step 3: Use /etc/hosts instead of Custom Domain
It will take a while for the DNS records to propagate. If you don't want to set up your own domain for the dokku or if you don't want to have to wait for the DNS to propagate you can set up your /etc/hosts

/etc/hosts
123.123.123.123     apps.yourdomain.com  
Where 123.123.123.123 is the IP of your digital ocean droplet.

Step 4: Dokku VHOST configuration
We need to check that the domain is configured properly on Dokku. The docs explain that if the hostname cannot be resolved at the time you create your dokku image, the domain may not be set.

To check if the domain was set, log in to your droplet as root.

ssh root@apps.yourdomain.com  
You should not need to enter a password because the droplet is set up to use public key authentication.

Once you're logged in, let's check if the VHOST file exists in

cd /home/dokku  
ls  
In my case, the VHOST file was not there. This was causing dokku to ask me for the dokku user's password when I tried to deploy the app.

root@apps:/home/dokku# ls  
HOSTNAME  VERSION  
If you do not see the VHOST file, you need to create it.

echo "apps.yourdomain.com" > /home/dokku/VHOST  
chown dokku:root /home/dokku/VHOST   -->
