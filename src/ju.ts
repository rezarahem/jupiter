#!/usr/bin/env node

import { program } from 'commander';
import { AddGithubAction } from './commands/add-github-aciton/add-github-action.js';
import { getUserInput } from './commands/main/get-user-input.js';
import { createDockerComposeBase } from './commands/main/create-docker-compose-base.js';
import { createConfigFile } from './commands/main/create-jupiter-config.js';
import { createEnvFile } from './commands/main/create-env-file.js';
import { createDockerIgnore } from './commands/main/create-docker-ingore.js';
import { createDockerfileNext } from './commands/main/create-dockerfile-next.js';

program.name('jupiter');

// sub commands
program.addCommand(AddGithubAction);

// main commmand
program.action(async () => {
  const { directory, sshPort, vpsIp, vpsUsername, app, email, domain } =
    await getUserInput();

  const { databaseUrl } = await createDockerComposeBase({
    app,
  });

  await createDockerIgnore({ directory });

  await createDockerfileNext();

  const dbRemoteSsh = `ssh -L 5432:localhost:5432 -p ${sshPort} ${vpsUsername}@${vpsIp}`;

  await createConfigFile({
    directory,
    databaseUrl,
    sshPort,
    vpsIp,
    vpsUsername,
    dbRemoteSsh,
    email,
    domain,
  });

  await createEnvFile({ directory, databaseUrl });
});

program.parse();
