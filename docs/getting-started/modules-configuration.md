---
id: modules-configuration
title: Modules configuration

---

## Swarmpit
It's possible to link the `swarmlet-registry` service as a registry in Swarmpit.
Log into the Swarmpit dashboard at https://swarmpit.yourdomain.com, go to the Registries panel and click the **`LINK REGISTRY`** button. Specify the account type, select Registry v2 to link the internal swarm registry.
```
Registry account type:   Registry v2
Name:                    swarmlet-registry
Url:                     http://swarmlet-registry:5000
Secured access:          true
Username:                <username configured during installation>
Password:                <password configured during installation>
```

## Matomo
Go to https://matomo.yourdomain.com and follow the installation wizard. In step 3, provide the following information:
```
Server database:      db
Login:                <username configured during installation>
Password:             <password configured during installation>
Database name:        matomo
```
Press next to save the changes to the database configuration. Create an administator account and add the JavaScript snippet to the website you would like to add to Matomo.

## Portainer
All set up.

## Swarmprom
The Swarmprom stack contains several services and can be quite memory-intensive. Please consider adding swap space if you're running low on memory.
