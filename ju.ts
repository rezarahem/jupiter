#!/usr/bin/env node

import { program } from 'commander';
import { CreateApp } from './src/commands/create-app/create-app.js';
import { Deploy } from './src/commands/deploy/deploy.js';

program
  .name('Jupiter')
  .description(
    'Jupiter is an in-progress CLI tool designed to simplify the process of building, deploying, and managing modern web applications.'
  );

program.addCommand(CreateApp);
program.addCommand(Deploy);

program.parse();
