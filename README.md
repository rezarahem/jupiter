# Jupiter

Jupiter is a CLI tool to simplify deploying modern web applications.

- 🔒 **SSL certificates** for secure communication.
- 🚀 **Zero downtime** during deployments.
- 🐳 **Docker-based architecture** for containerization and scalability.

**Note**: Jupiter is currently in development and is not stable. It is being constantly updated.

## Prerequisites

1. **VPS running Ubuntu 24.04 or 22.04**
2. **Domain with DNS pointing to the VPS**  
   Cloudflare DNS is recommended for DDoS protection.

## VPS Setup

Jupiter relies on Docker, Nginx, and Certbot.

### Install Required Packages

Run the following to set up Docker, Nginx, and Certbot:

**Docke and Docker Compose**

```bash
sudo apt update && sudo apt upgrade -y
```

```bash
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

```bash
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

```bash
sudo apt update
```

```bash
sudo apt install -y docker-ce docker-ce-cli containerd.io
```

```bash
sudo curl -L https://github.com/docker/compose/releases/download/v2.19.1/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**Nginx and Certbot**

```bash
sudo apt-get update -y
```

```bash
sudo apt-get install nginx -y
```

```bash
sudo systemctl start nginx
```

```bash
sudo systemctl enable nginx
```

```bash
sudo apt-get install software-properties-common -y
```

```bash
sudo add-apt-repository universe -y
```

```bash
sudo apt-get update -y
```

```bash
sudo apt-get install certbot python3-certbot-nginx -y
```

Verify installations:

```bash
docker --version && docker-compose --version && nginx -v && certbot --version
```

## Getting Started

1. **Configure SSH**  
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

   Push to a remote repo, then initialize with:

   ```bash
   ju init
   ```

   Follow the prompts to configure your deployment.

4. **Deploy**  
   Push your latest changes to the repo, then deploy with:
   ```bash
   ju d
   ```

**Note:** Ensure your remote repo is up-to-date before deploying.

---

This is just the beginning! Share your thoughts or suggest features to shape Jupiter into the ultimate deployment tool. 🚀
