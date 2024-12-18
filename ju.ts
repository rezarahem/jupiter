#!/usr/bin/env node

import { program } from 'commander';
import { up } from './src/commands/up/up.js';
import { CreateApp } from './src/commands/create-app/create-app.js';
import { AddDep } from './src/commands/add-dep/add-dep.js';
import { RemoveApp } from './src/commands/remove-app/remove-app.js';
import { ListApps } from './src/commands/list-apps/list-apps.js';

program
  .name('Jupiter')
  .description(
    'Jupiter is an in-progress CLI tool designed to simplify the process of building, deploying, and managing modern web applications.'
  );

program.addCommand(CreateApp);
program.addCommand(AddDep);
program.addCommand(ListApps);
program.addCommand(RemoveApp);
program.addCommand(up);

program.parse();
