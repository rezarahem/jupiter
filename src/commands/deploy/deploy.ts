import { Command } from 'commander';
import { streamCommand } from '../../utils/stream-command.js';
import dotenv from 'dotenv';

const command = ({ variables }: { variables: Record<string, string> }) => {
  const envVars = Object.entries(variables)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');
  return `${envVars} bash ./jux/deploy.sh`;
};

export const Deploy = new Command('deploy')
  .alias('d')
  .description('Deploy the application to the specified environment')
  .action(async () => {
    dotenv.config({ path: '.jupiter' });

    const APP = process.env.APP;

    if (!APP) {
      console.error('Missing required variable, App name');
      process.exit(1);
    }

    await streamCommand(`APP=${APP} ~/jupiter/jux/deploy.sh`);
  });
