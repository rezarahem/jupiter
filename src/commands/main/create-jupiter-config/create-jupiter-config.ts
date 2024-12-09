import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { createFile } from '../../../utils/create-file.js';

/**
 * Function to create the config.json file with user input.
 */
export const createConfigFile = async () => {
  // Prompt for configuration data
  const { repo, title, domain, email } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is your project named?',
      default: 'Jupiter'
    },
    {
      type: 'input',
      name: 'repo',
      message: 'Enter the repository name:',
    },
    {
      type: 'input',
      name: 'domain',
      message: 'Enter the domain name:',
    },
    {
      type: 'input',
      name: 'email',
      message: 'Enter the email address:',
    },
  ]);

  // Generate the configuration object
  const juConfig = {
    repo,
    dir: title,
    image: title,
    net: title,
    domain,
    email,
  };

  // Convert the configuration object into JSON string
  const configContent = JSON.stringify(juConfig, null, 2);

  // Create the config.json file
  const rootDir = path.resolve(__dirname); // Resolves to the root directory of your project
  const filename = 'config.json';
  await createFile(rootDir, filename, configContent);
};
