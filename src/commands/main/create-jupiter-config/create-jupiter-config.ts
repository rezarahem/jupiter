import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { createFile } from '../../../utils/create-file.js';
import { getDirectoryInfo } from '../dic.js';

/**
 * Function to create the config.json file with user input.
 */
export const createConfigFile = async () => {
  // Prompt for configuration data
  const { title, domain, email } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is your project named?',
      default: 'Jupiter'
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

  const { directory, appTitle } = getDirectoryInfo(title);

  // Generate the configuration object
  const juConfig = {
    dir: appTitle,
    image: appTitle,
    net: appTitle,
    domain,
    email,
  };

  // Convert the configuration object into JSON string
  const configContent = JSON.stringify(juConfig, null, 2);

  // Create the config.json file
  const rootDir = path.resolve(__dirname); // Resolves to the root directory of your project
  const filename = 'config.json';
  await createFile(rootDir, filename, configContent);

  return { directory, title: appTitle }
};
