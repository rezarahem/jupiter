# Jupiter

Jupiter is a CLI tool designed to simplify the deployment of modern web applications.

- 🚀 **Zero downtime** deployments.
- 🐳 **Docker-based architecture** for containerization and scalability.
- 🔒 **SSL certificates** for secure communication.
- ⚡ **CI/CD** integration for automated workflows.
- 🧱 **Dependency management** using Docker Compose for seamless service orchestration.

**Note** Jupiter is actively under development and is not yet stable. Frequent updates and changes are being made to improve functionality.

**Note** Currently, Jupiter supports deploying Next.js applications only.

---

1. [Prerequisites](#prerequisites)
2. [VPS Setup](#vps-setup)
3. [Getting Started](#getting-started)
   - [Configure SSH](#configure-ssh)
   - [Install Jupiter CLI](#install-jupiter-cli)
   - [Initialize a Project](#initialize-a-project)
   - [Deploy](#deploy)
4. [CI/CD](#cicd)
   - [Add the Github action](#add-the-github-action)
   - [Add SSH Private Key to Repository Secrets](#add-ssh-private-key-to-repository-secrets)
   - [Additional Required Secrets](#additional-required-secrets)
5. [Add Dependency](#add-dependency)
   - [Docker Compose Network Configuration](#docker-compose-network-configuration)
   - [Assigning the Network to Services](#assigning-the-network-to-services)
   - [Running Dependencies](#running-dependencies)
   - [Important Notes](#important-notes)

## Prerequisites

1. **VPS running Ubuntu 24.04 or 22.04**
2. **Domain with DNS pointing to the VPS**  
   Cloudflare DNS service is recommended for DDoS protection.
3. **GitHub Account and Repository**\
   You will need a GitHub account for version control and integration with CI/CD pipelines.

## VPS Setup

Jupiter relies on Docker, Nginx, Certbot.

- **Docker:** For containerizing apps, ensuring consistency and easy deployment.
- **Nginx:** Acts as a reverse proxy and load balancer for web traffic.
- **Certbot:** Automates SSL certificate management for HTTPS security.

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

1. #### **Configure SSH**

   You need to generate two SSH key pairs: one for establishing a secure connection from your local machine to your VPS, and another for authenticating your VPS with your GitHub account. It's essential to pay attention to where you generate these keys to ensure proper configuration.

   - **Local to VPS**

     To establish a secure connection from your local machine to your VPS, generate an SSH key:

     ```bash
     ssh-keygen -t ed25519 -C "your_email@example.com"
     ```

     Retrieve the public key:

     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```

     Copy the public key and add it to the `~/.ssh/authorized_keys` file on your VPS

   - **VPS to Github Acount**

     The process for setting up the SSH key on your VPS for GitHub is similar.

     Generate an SSH key on your VPS:

     ```bash
     ssh-keygen -t ed25519 -C "your_email@example.com"
     ```

     Retrieve the public key:

     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```

     Copy the public key and add it to your GitHub account by visiting [Add SSH Key](https://github.com/settings/ssh/new)

2. #### **Install Jupiter CLI**

   ```bash
   npm i -g ju
   ```

3. #### **Initialize a Project**

   Create or use an existing Next.js project:

   ```bash
   create-next-app@latest
   ```

   ```bash
   ju init
   ```

   Follow the prompts to configure your deployment.

4. #### **Deploy**

   Once your project is ready, push your latest changes to GitHub and then deploy your project with the following command:

   ```bash
   ju d
   ```

   **Note**: If you deploy your project and notice an older version is live, it's likely because your latest changes haven't been pushed to GitHub. Ensure your commits are up-to-date and pushed before running the deployment command to reflect the most recent changes.

## CI/CD

1. #### **Add the Github action**

   To integrate CI/CD with your deployment workflow, run the following command and follow the prompts:

   ```bash
   ju ci
   ```

2. #### **Add SSH Private Key to Repository Secrets**

   Generate or reuse the SSH key you previously created for your local machine.

   For simplicity, we recommend using the same SSH key. However, if you choose to generate a new key pair, be sure to add the public key to the `~/.ssh/authorized_keys` file on your VPS, just as you did for your local machine.

   To retrieve the private key, run:

   ```bash
   cat ~/.ssh/id_ed25519
   ```

   Copy the private key and add it as `SSH_PRIVATE_KEY` in your repository's GitHub Action secrets. You can add it by navigating to:

   `github.com/<username>/<repository-name>/settings/secrets/actions/new`

   Replace username and repository-name with the appropriate values for your repository.

3. #### **Additional Required Secrets**

   You must also add the following repository secrets for a successful deployment:

   - HOST_IP: Your VPS's IP address
   - HOST_USER: Your VPS username
   - HOST_PORT: SSH port
   - APP: The name of your app, chosen during the project initialization

**Note**: While you are free to choose custom names for these secrets, be aware that the `ju ci` command generates the GitHub action with the default secret names. If you use different names, ensure you also update the `deploy.yml` file at `.github/workflows/deploy.yml` to reflect the new secret names.

Your CI/CD setup is now complete. Whenever you push to the branch you selected during the `ju ci` command, the deployment process will automatically trigger. You can monitor the status of your GitHub Actions by visiting:

`github.com/<username>/<repository-name>/actions`

## Add Dependency

Jupiter simplifies the management of dependencies like databases or storage buckets by utilizing Docker Compose. To ensure compatibility and smooth operation, please follow the rules outlined below.

1. #### **Docker Compose Network Configuration**

   In your `docker-compose.yml` file, it’s essential to define a network that corresponds to your project. The network configuration must match the app name selected during the Jupiter project initialization.

   Example `docker-compose.yml`:

   ```
   networks:
     <app-name>:
       name: <app-name>
       external: true
       driver: bridge
   ```

   Note that the `<app-name>` should exactly match your project name, as chosen when initializing the Jupiter project. The network type must be `external`, as Jupiter does not create networks via Docker Compose. By marking the network as `external`, you allow Docker Compose to interface with the relevant Jupiter-managed network.

2. #### **Assigning the Network to Services**

   Ensure that every service you add in the `docker-compose.yml` file is linked to the defined network.

   Example `docker-compose.yml`:

   ```
   services:
      postgres:
         image: postgres:latest
         container_name: postgres_container
         environment:
            POSTGRES_USER: your_username
            POSTGRES_PASSWORD: your_password
            POSTGRES_DB: your_database
         ports:
            - '5432:5432'
         volumes:
            - postgres_data:/var/lib/postgresql/data
         networks:
            - <app-name>

   volumes:
      postgres_data:

   networks:
      <app-name>:
         name: <app-name>
         external: true
         driver: bridge
   ```

3. #### **Running Dependencies**

   With your Docker Compose file properly configured, you can now use Jupiter to deploy your dependencies on the host. Simply execute the following command:

   ```bash
   ju r
   ```

#### **Important Notes:**

- This command will create any new dependencies defined in the docker-compose.yml file and run them on the host.
- If any previously created dependencies are already running, they will not be recreated. If they are stopped, they will be started again to ensure they’re running smoothly.
- You can safely run this command as many times as needed, ensuring no duplicate dependencies or containers are created.

---

This is just the beginning! Share your thoughts or suggest features to shape Jupiter into the ultimate deployment tool. 🚀
