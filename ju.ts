#!/usr/bin/env node

import { program } from 'commander';
import { InitApp } from './src/commands/init-app/init-app.js';
import { Deploy } from './src/commands/deploy/deploy.js';
import { UpdateHost } from './src/commands/update-host/update-host.js';
import { InitGithubCi } from './src/commands/init-github-ci/init-github-ci.js';
import { RunDeps } from './src/commands/run-deps/run-deps.js';
import { GetOpenPort } from './src/commands/get-open-port/get-open-port.js';

program
  .name('Jupiter')
  .description(
    'Jupiter is an in-progress CLI tool designed to simplify the process of building, deploying, and managing modern web applications.'
  )
  .version('0.0.0-dev.16', '-v, --version', 'Output the version number');

program.addCommand(InitApp);
program.addCommand(Deploy);
program.addCommand(InitGithubCi);
program.addCommand(RunDeps);
program.addCommand(GetOpenPort);
program.addCommand(UpdateHost);
program.parse();
