#!/usr/bin/env node

import { execSync } from 'child_process';
import { program } from 'commander';
import inquirer from 'inquirer';
import { AddGithubAction } from './commands/add-github-aciton/add-github-action.js';
import { createEnvFile } from './commands/main/create-env-file/create-env-file.js';
import { checkGitInstallation, gitClone } from './commands/main/git.js';
import { createDirectory, getDirectoryInfo } from './commands/main/dic.js';
import { createConfigFile } from './commands/main/create-jupiter-config/create-jupiter-config.js';


program.name('jupiter');

// sub commands
program.addCommand(AddGithubAction);

// main commmand
program.action(async () => {
  try {
    checkGitInstallation();
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }

  const { directory, title } = await createConfigFile()

  createDirectory(directory);

  try {
    const repositoryUrl = 'https://github.com/rezarahem/jupiter-core.git';
    gitClone(repositoryUrl, directory);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
  
  try {
    execSync('npm install', { stdio: 'inherit', cwd: directory });
    console.log('Dependencies installed successfully!');
  } catch (error) {
    console.error(
      'Failed to install dependencies. Please run "npm install" manually in the project directory.'
    );
    process.exit(1);
  }

  createEnvFile(directory, title)
});

program.parse();
