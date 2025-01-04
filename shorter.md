# Jupiter

Jupiter is a CLI tool to simplify deploying modern web applications.

## Prerequisites

1. **VPS running Ubuntu 24.04 or 22.04**  
2. **Domain with DNS pointing to the VPS**  
   Cloudflare DNS is recommended for DDoS protection.

## VPS Setup

Jupiter relies on Docker, Nginx, and Certbot.  

### Install Required Packages

Run the following to set up Docker, Nginx, and Certbot:  
```bash
sudo apt update && sudo apt upgrade -y
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove -y "$pkg"; done
sudo apt install -y ca-certificates curl nginx software-properties-common
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose certbot python3-certbot-nginx
sudo systemctl enable nginx && sudo systemctl start nginx
```

Verify installations:  
```bash
docker --version && docker-compose --version && nginx -v && certbot --version
```

## Getting Started

1. **Configure SSH**  
   Generate an SSH key:  
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/key_name
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
