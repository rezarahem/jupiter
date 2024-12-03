import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';


export const AddGithubAction = new Command('add-deploy-workflow')
.argument('<secret>', 'Secret used for SSH authentication')
.action(async (secret: string) => {
  const workflowDir = path.join(process.cwd(), '.github', 'workflows');
  const workflowFile = path.join(workflowDir, 'deploy.yml');

  const workflowContent = `
name: Deploy to VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: your_linux_version
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Set up SSH
        run: |
          mkdir -p ~/.ssh
          echo "\${{ secrets.${secret} }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
          ssh-keyscan you_vps_ip >> ~/.ssh/known_hosts

      - name: Run deploy script on VPS
        run: |
          ssh username@you_vps_ip "~/deploy.sh"
`;

// Check if the workflow file already exists
if (fs.existsSync(workflowFile)) {
    // Ask the user if they want to overwrite the existing file
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `The file ${workflowFile} already exists. Do you want to overwrite it?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log('Operation canceled. The file was not overwritten.');
      process.exit(1);
    }
  }

  fs.mkdirSync(workflowDir, { recursive: true });
  fs.writeFileSync(workflowFile, workflowContent.trim(), 'utf8');

  console.log(`Workflow file created at: ${workflowFile}`);

});

