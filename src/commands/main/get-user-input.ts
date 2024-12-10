import inquirer from 'inquirer';
import { getDirectoryInfo } from './dic.js';
import { z } from 'zod';

const domainSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
    'Invalid domain name (must follow the format "example.com")'
  );

const emailSchema = z.string().email('Invalid email address');

export const getUserInput = async () => {
  let domain: string;

  while (true) {
    const { domainInput } = await inquirer.prompt([
      {
        type: 'input',
        name: 'domainInput',
        message: 'Enter the domain name:',
      },
    ]);

    try {
      domainSchema.parse(domainInput);
      domain = domainInput;
      break;
    } catch (e: any) {
      console.error(e.errors[0].message);
    }
  }

  let email: string;

  while (true) {
    const { emailInput } = await inquirer.prompt([
      {
        type: 'input',
        name: 'emailInput',
        message: 'Enter the email address:',
      },
    ]);

    try {
      emailSchema.parse(emailInput);
      email = emailInput;
      break;
    } catch (e: any) {
      console.error(e.errors[0].message);
    }
  }

  const { directory, app } = getDirectoryInfo('.');

  return {
    app,
    domain,
    email,
    directory,
  };
};
