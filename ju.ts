#!/usr/bin/env node

import { program } from 'commander';
import { CreateApp } from './src/commands/create-app/create-app.js';
import { Deploy } from './src/commands/deploy/deploy.js';
import { UpdateScript } from './src/commands/update-scripts/update-scripts.js';

program
  .name('Jupiter')
  .description(
    'Jupiter is an in-progress CLI tool designed to simplify the process of building, deploying, and managing modern web applications.'
  )
  .version('0.0.0-dev.5', '-v, --version', 'Output the version number');

program.addCommand(CreateApp);
program.addCommand(Deploy);
program.addCommand(UpdateScript);

program.parse();
