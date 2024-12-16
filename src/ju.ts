#!/usr/bin/env node

import { program } from 'commander';
import { AddApp } from './commands/add-app/add-app.js';

program.name('Jupiter');

program.addCommand(AddApp);

//   // download sh scripts on the vps
//   // install docker
//   // install nginx
//   // deploy
// });

program.parse();
