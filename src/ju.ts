#!/usr/bin/env node

import { program } from 'commander';
import { AddGithubAction } from './commands/add-github-aciton/add-github-action.js';
import { getUserInput } from './commands/main/get-user-input.js';
import { createDockerComposeBase } from './commands/main/create-docker-compose-base.js';
import { createConfigFile } from './commands/main/create-jupiter-config.js';
import { createEnvFile } from './commands/main/create-env-file.js';

program.name('jupiter');

// sub commands
program.addCommand(AddGithubAction);

// main commmand
program.action(async () => {
  const { directory, app, domain, email } = await getUserInput();

  const { privateConnectionUrl } = await createDockerComposeBase({
    directory,
    app,
  });

  await createConfigFile({
    app,
    directory,
    domain,
    email,
    privateConnectionUrl,
  });

  // await createEnvFile({ directory, privateConnectionUrl });
});

program.parse();
