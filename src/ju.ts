#!/usr/bin/env node

import { program } from 'commander';
import { up } from './commands/up/up.js';
import { CreateApp } from './commands/create-app/create-app.js';
import { AddDep } from './commands/add-dep/add-dep.js';

program
  .name('Jupiter')
  .description(
    'Jupiter is an in-progress CLI tool designed to simplify the process of building, deploying, and managing modern web applications.'
  );

program.addCommand(up);
program.addCommand(CreateApp);
program.addCommand(AddDep);

//   // download sh scripts on the vps
//   // install docker
//   // install nginx
//   // deploy
// });

program.parse();
