#!/usr/bin/env node

import { program } from 'commander';
import { AddGithubAction } from './commands/add-github-aciton/add-github-action.js';
import { getUserInput } from './commands/main/get-user-input.js';
import { createDockerComposeBase } from './commands/main/create-docker-compose-base.js';
import { createConfigFile } from './commands/main/create-jupiter-config.js';
import { createEnvFile } from './commands/main/create-env-file.js';
import { createDockerIgnore } from './commands/main/create-docker-ingore.js';
import { createDockerfileNext } from './commands/main/create-dockerfile-next.js';
import { Deploy } from './commands/deploy/deploy.js';

// sub commands
program.addCommand(AddGithubAction);
program.addCommand(Deploy);

// *** //
// main commmand
program.name('jupiter');
program.action(async () => {
  const userInput = await getUserInput();

  const { databaseUrl } = await createDockerComposeBase({
    app: userInput.app,
  });

  await createDockerIgnore({ directory: userInput.directory });

  await createDockerfileNext();

  const dbRemoteSsh = `ssh -L 5432:localhost:5432 -p ${userInput.sshPort} ${userInput.vpsUsername}@${userInput.vpsIp}`;

  await createConfigFile({
    ...userInput,
    dbRemoteSsh,
  });

  await createEnvFile({ directory: userInput.directory, databaseUrl });
});

program.parse();
