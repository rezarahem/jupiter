import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

export const AddGithubAction = new Command('deploy-workflow')
  .alias('dw')
  .action(async () => {
    const { secretName, username, ipOrDomain, runnerLabel, sshPort } =
      await inquirer.prompt([
        {
          type: 'input',
          name: 'secretName',
          message: 'Enter the name of the deploy SSH secret:',
        },
        {
          type: 'input',
          name: 'username',
          message: 'Enter the username for SSH authentication:',
        },
        {
          type: 'input',
          name: 'ipOrDomain',
          message: 'Enter the IP address or domain of the VPS:',
        },
        {
          type: 'input',
          name: 'sshPort',
          message: 'Enter the IP address or domain of the VPS:',
          default: '22',
        },
        {
          type: 'input',
          name: 'runnerLabel',
          message: 'Enter the runner label (e.g., ubuntu-latest):',
          default: 'ubuntu-24.04',
        },
      ]);

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
    runs-on: ${runnerLabel}
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Set up SSH
        run: |
          mkdir -p ~/.ssh
          echo "\${{ secrets.${secretName} }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
          ssh-keyscan -p ${sshPort} ${ipOrDomain} >> ~/.ssh/known_hosts

      - name: Run deploy script on VPS
        run: |
          ssh -p ${sshPort} ${username}@${ipOrDomain} "~/deploy.sh"
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
