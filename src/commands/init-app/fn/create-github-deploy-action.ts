import { createFile } from '../../../utils/create-file.js';
import { userInput } from '../../../utils/user-input.js';
import { branchNameSchema } from '../../../zod/index.js';

export const createGithubDeployAction = async () => {
  const defaultBranch = await userInput({
    prompt:
      'Enter the name of your default branch (you can always change this later): ',
    schema: branchNameSchema,
  });

  const content = `name: Deployment

on:
  push:
    branches:
      - ${defaultBranch.toLowerCase()}

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Add HOST to known_hosts
        run: |
          # Ensure the SSH directory exists
          mkdir -p ~/.ssh
          chmod 700 ~/.ssh
            
          ssh-keyscan -p \${{ secrets.HOST_PORT }} -H \${{ secrets.HOST_IP }} >> ~/.ssh/known_hosts
          echo "Added \${{ secrets.HOST_IP }} to known_hosts"

      - name: Set up SSH key
        run: |
          mkdir -p ~/.ssh
          echo "\${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519

      - name: Deploy to VPS
        run: |
          ssh -o UserKnownHostsFile=~/.ssh/known_hosts -p \${{ secrets.HOST_PORT }} \${{ secrets.HOST_USER }}@\${{ secrets.HOST_IP }} "APP=\${{ secrets.APP }} ~/jupiter/jux/deploy.sh"`;

  await createFile({
    content,
    directory: `${process.cwd()}/.github/workflows`,
    filename: 'deploy.yml',
  });
};
