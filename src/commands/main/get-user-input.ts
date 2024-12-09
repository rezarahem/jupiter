import inquirer from 'inquirer';
import { getDirectoryInfo } from './dic.js';

export const getUserInput = async () => {
  const { title, domain, email } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is your project named?',
      default: 'Jupiter',
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

  const { directory, app } = getDirectoryInfo(title);

  return {
    app,
    domain,
    email,
    directory,
  };
};
