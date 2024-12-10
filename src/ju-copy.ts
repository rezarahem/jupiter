#!/usr/bin/env node

import { program } from 'commander';
import { AddGithubAction } from './commands/add-github-aciton/add-github-action.js';
import { createEnvFile } from './commands/main/create-env-file.js';
import { getUserInput } from './commands/main/get-user-input.js';
import { createConfigFile } from './commands/main/create-jupiter-config.js';
import { createDockerComposeBase } from './commands/main/create-docker-compose-base.js';
import fs from 'fs/promises'; // Using fs.promises for file checks

program.name('jupiter');

// sub commands
program.addCommand(AddGithubAction);

// main commmand
program.action(async () => {
  const { directory, app, domain, email } = await getUserInput();

  createDockerComposeBase({ directory, app });
  createConfigFile({ app, directory, domain, email });
  createEnvFile({ app, directory });
});

program.parse();
