---
id: domain-configuration
title: Domain configuration

---

## Getting started

Add a `label` under the `deploy` key in your project compose file to expose your service on the desired domain. Traefik will pick up any changes to updating services so whenever you redeploy, Traefik will try to create SSL certificates using Let's Encrypt if they don't exist already.  

Compose files are compatible with environment variables. Place a `.env` file next to the `docker-compose.yml` project file to use the environment variables.

### Example project compose file
*`.env`*
```bash
THE_DOMAIN=my-website.com
```
*`docker-compose.yml`*
```yml {18,22}
version: '3.7'

services:
  my-website-frontend:
    build: .
    image: ${SWARMLET_REGISTRY}/my-website-frontend
    networks:
      - traefik-public
    deploy:
      mode: replicated
      replicas: 1
      labels:
        - traefik.enable=true
        - traefik.tags=traefik-public
        - traefik.docker.network=traefik-public
        - traefik.swarmlet-registry.enable=true
        - traefik.swarmlet-registry.port=5000
        - traefik.swarmlet-registry.frontend.rule=Host:${THE_DOMAIN}
        - traefik.swarmlet-registry.frontend.entryPoints=http,https
        - traefik.swarmlet-registry.frontend.passHostHeader=true
        - traefik.swarmlet-registry.frontend.headers.SSLRedirect=true
        - traefik.swarmlet-registry.frontend.headers.SSLHost=${THE_DOMAIN}
        - traefik.swarmlet-registry.frontend.headers.STSIncludeSubdomains=true
        - traefik.swarmlet-registry.frontend.headers.STSPreload=true

networks:
  traefik-public:
    external: true
```

### Updating a domain
Maybe you want to host the registry on a different domain, instead of the default `registry.${ROOT_DOMAIN}`. To update any module, simply `git pull` the modules' repository, edit the configuration, commit and push to redeploy. Another option would be to use a service like Swarmpit or Portainer to redeploy using a web interface.  

Example: Changing the exposed internal registry URL to https://custom-registry.my-domain.com
```bash
git clone git@swarm:registry
cd registry

### edit '.env' and 'docker-compose.yml'

git add . && git commit -m 'update'
git push origin master

# $ ...
# $ remote:  Stack deployed:
# $ remote: [registry] — https://custom-registry.my-domain.com
```
Try it out:
```bash
docker login custom-registry.my-domain.com
$ Username: <provide username configured during installation>
$ Password: <provide password configured during installation>
$ Login Succeeded
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
