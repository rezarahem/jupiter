#!/usr/bin/env node

import { program } from 'commander';
import { AddApp } from './commands/add-app/add-app.js';
import { up } from './commands/up/up.js';

program.name('Jupiter');

program.addCommand(AddApp);
program.addCommand(up);

//   // download sh scripts on the vps
//   // install docker
//   // install nginx
//   // deploy
// });

program.parse();
