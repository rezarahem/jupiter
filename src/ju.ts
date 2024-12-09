#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import { checkGitInstallation, gitClone } from './utils/git.js';
import { createDirectory, getDirectoryInfo } from './utils/dic.js';
import { installDependencies } from './utils/npm.js';
import { AddGithubAction } from './commands/add-github-aciton/add-github-action.js';
import { createEnvFile } from './commands/main/create-env-file/create-env-file.js';

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

  const { title } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is your project named?',
      default: 'Jupiter',
    },
  ]);

  const { directory, appTitle } = getDirectoryInfo(title);

  createDirectory(directory);

  try {
    const repositoryUrl = 'https://github.com/rezarahem/jupiter-core.git';
    gitClone(repositoryUrl, directory);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }

  try {
    // await installDependencies(directory);
    installDependencies(directory);
    console.log('Dependencies installed successfully!');
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }

  createEnvFile(directory, appTitle)
});

program.parse();
