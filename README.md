# Setup Commands

## Install the Web Server, Database, and Tools
```bash
apt install nginx mariadb-server python3-certbot-nginx curl git
```

## Set up domain and DNS records
Register your domain, create an `A` record and `AAAA` record for `@` with the IPv4 and IPv6 of your VM

## Get an SSL Certificate for the Web Server
```bash
certbot
```

## Get Software needed to run the Application
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash
apt install nodejs
npm i -g yarn
yarn
```

## Set up the Database
```bash
mariadb
```

```sql
CREATE USER app@localhost IDENTIFIED BY 'secret';
CREATE DATABASE counterdb;
GRANT ALL PRIVILEGES ON counterdb.* TO app@localhost;
FLUSH PRIVILEGES;
```

```bash
mariadb counterdb < database.sql
```

## Use Systemd to run the Application
```bash
useradd -rUM myapp
cp myapp.service /etc/systemd/system/myapp.service
systemctl daemon-reload
systemctl reenable myapp
systemctl restart myapp
systemctl status myapp
```

## Use Nginx as a Reverse Proxy
In the file `/etc/nginx/sites-enabled/default` find the `server` block with `SSL configuration` (the one with `listen 443 ssl`)

In that `server` block, there should only be one `location` block and it should contain the following
```
	location / {
		proxy_pass http://localhost:3000;
		include proxy_params;
	}
```

To edit the file, use:
```bash
nano /etc/nginx/sites-enabled/default
```