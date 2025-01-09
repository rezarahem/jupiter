# Jupiter

Jupiter is a CLI tool designed to simplify the deployment of modern web applications.

- 🔒 **SSL certificates** for secure communication.
- 🚀 **Zero downtime** during deployments.
- 🐳 **Docker-based architecture** for containerization and scalability.

---

**Note** Currently, Jupiter supports deploying Next.js applications only.

**Note** Jupiter is actively under development and is not yet stable. Frequent updates and changes are being made to improve functionality.

## Prerequisites

1. **VPS running Ubuntu 24.04 or 22.04**
2. **Domain with DNS pointing to the VPS**  
   Cloudflare DNS is recommended for DDoS protection.

## VPS Setup

Jupiter relies on Docker, Nginx, and Certbot.

### Install Required Packages

Run the following to set up Docker, Nginx, and Certbot:

**Docker**

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

**Nginx**

```bash
sudo apt-get update -y && \
sudo apt-get install nginx -y && \
echo "limit_req_zone \$binary_remote_addr zone=mylimit:10m rate=10r/s;" | \
    sudo tee /etc/nginx/conf.d/rate_limit.conf > /dev/null && \
sudo systemctl start nginx && \
sudo systemctl enable nginx
```

**Certbot**

```bash
sudo apt-get install software-properties-common -y
sudo add-apt-repository universe -y
sudo apt-get update -y
sudo apt-get install certbot python3-certbot-nginx -y
sudo wget https://raw.githubusercontent.com/certbot/certbot/main/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -P /etc/letsencrypt/
sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
```

Verify installations:

```bash
docker --version && nginx -v && certbot --version
```

## Getting Started

I'm working on it, stay tuned! 🔥🛠️🚀

<!-- 1. **Configure SSH**
   Generate an SSH key:

   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

   Add the public key to the VPS in `~/.ssh/authorized_keys`.

2. **Install Jupiter CLI**

   ```bash
   npm i -g ju
   ```

3. **Initialize a Project**
   Create or use an existing Next.js project:

   ```bash
   create-next-app@latest
   ```

   ```bash
   ju init
   ```

   Follow the prompts to configure your deployment.

4. **Deploy**

   Finally, deploy your project:

   ```bash
   ju d
   ``` -->

<!-- ---

This is just the beginning! Share your thoughts or suggest features to shape Jupiter into the ultimate deployment tool. 🚀 -->
