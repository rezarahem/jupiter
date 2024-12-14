#!/usr/bin/env node

import { program } from 'commander';
import { getAppName } from './commands/main/get-app-name.js';
import { getIint } from './commands/main/git-init.js';
import { getUserInput } from './commands/main/get-user-input.js';
import { addEnvVar } from './utils/add-env-var.js';
import { createJupiterFile } from './commands/main/create-jupiter-file.js';

// sub commands
// program.addCommand(NewApp);
// program.addCommand(Setup);
// program.addCommand(AddGithubAction);

// *** //
// main commmand
program.name('jupiter');
program.action(async () => {
  const currentDic = process.cwd();

  getIint();

  createJupiterFile();

  const userInput = await getUserInput();

  await addEnvVar({ directory: currentDic, variables: userInput });

  await getAppName();
});

program.parse();
