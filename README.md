# Jupiter

Jupiter is an in-progress CLI tool designed to simplify the process of deploying modern web applications.

## Prerequisites

1. **A VPS running Ubuntu 24.04**

   Ubuntu 22.04 should work as well, though it hasn't been tested.

2. **A domain name with properly configured DNS settings pointing to the VPS**

   Using Cloudflare's DNS service is recommended, as it also provides DDoS attack protection.

## Setup

1. **SSH Connection**

   To begin using Jupiter, it is essential to ensure that the SSH connection is correctly configured on both your local machine and the VPS.

   **Generate a New SSH Key Pair**

   Generate a new pair of SSH keys on your local machine by running the following command in your terminal:

   ```
   ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/key_name
   ```

   **Note**: Ensure that the key pair is generated inside the (homedirectory) `~/.ssh` directory on your local machine. Generating the keys outside `.ssh` may cause configuration issues.

   **Retrieve the Public Key**

   Once the key pair is generated, retrieve the public key by running:

   ```
   cat ~/.shh/key_name.pub
   ```

   **Add the Public Key to the VPS**

   Copy the public key displayed in your terminal.

   Log in to your VPS using the root user.

   On the VPS, open the `authorized_keys` file in the nano editor by running:

   ```
   nano ~/.ssh/authorized_keys
   ```

   Paste the copied public key into the file.

   Save the file by pressing `Ctrl + S`.

   Exit the editor with `Ctrl + X`.

   Your SSH connection should now be configured, enabling secure communication between your local machine and the VPS.

2. **Intalling Jupiter CLI**

   To install the Jupiter CLI, run the following command:

   ```
   npm i -g ju
   ```

3. **Starting a New Project**

   Jupiter does not initiate new projects directly; it is designed to be added to existing ones. Currently, Jupiter supports only Next.js, though I plan to extend support to additional frameworks in the future.

   To get started, create a new Next.js project using the following command, or skip this step if you already have an existing Next.js project ready for deployment:

   ```
   create-next-app@latest
   ```

   Next, push your project to a remote repository (like Github), as we need to retrieve the source code from there.

   Then, use the Jupiter CLI to generate the configuration files required for deployment by running the following command:

   ```
   ju init
   ```

   This command, `ju initialize-app` or `ju init`, will prompt you with several questions, as follows:

   ```
   - Enter your GitHub SSH repository clone URL:
   - Enter the domain name:
   - Enter the email address:
   - Enter your VPS username account:
   - Enter your VPS IP number:
   - Enter your SSH port number:
   - Enter your SSH private key handle:
   - What's your project called:
   ```

   It creates several files that will be used for future commands and deployments. Additionally, it checks your VPS and uploads the necessary bash scripts to ensure proper setup.

   Afterward, push your changes to your remote repo to include the newly added configuration files.

4. **Deployment**

   The true power of Jupiter lies in this command. Whenever you're ready to deploy, simply run:

   ```
   ju d
   ```

   This command connects to your VPS via SSH, executes the deployment script, and deploys the latest version of your project from the remote repository to your VPS.

   **Note** This command, `ju deploy`, deploys from your remote repository, not from your local machine. Don't be confused if you see an older version after deployment; this typically happens if you haven't pushed the latest changes to the remote repository before running the command. Make sure your remote repository is up-to-date before deploying.

   CI/CD is coming soon—just need to lay the foundation first! It’s like building a house, you can't skip the groundwork.

That's it! This is Jupiter's easy deployment process. I have tons of features in mind, but I need to make these first two commands stable before moving on to the rest.

In the meantime, I'd love to hear your thoughts! Let me know what works for you, what could be better, or what features you'd love to see in the future. Your feedback will shape Jupiter into the tool we all need!
