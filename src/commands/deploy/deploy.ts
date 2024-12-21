import { Command } from 'commander';
import { checkApp } from '../../utils/check-app.js';
import dotenv from 'dotenv';
import { streamCommand } from '../../utils/stream-command.js';

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
    const WEBAPP = await checkApp();
    dotenv.config({ path: '.jupiter' });
    const APP = process.env.APP || 'defaultAppName';
    const EMAIL = process.env.EMAIL || 'defaultEmail';
    const DOMAIN = process.env.DOMAIN || 'defaultDomain';

    const cmd = command({
      variables: { APP, EMAIL, DOMAIN, WEBAPP },
    });

    await streamCommand(cmd);
  });
