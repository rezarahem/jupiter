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
    const WEB = await checkApp();
    dotenv.config({ path: '.jupiter' });

    const APP = process.env.APP;
    const EMAIL = process.env.EMAIL;
    const DOMAIN = process.env.DOMAIN;
    const REPO = process.env.REPO;

    if (!APP || !EMAIL || !DOMAIN || !REPO) {
      console.error(
        'Missing required environment variables: APP, EMAIL, or DOMAIN'
      );
      process.exit(1);
    }

    const cmd = command({
      variables: { APP, EMAIL, DOMAIN, WEB, REPO },
    });

    await streamCommand(cmd);
  });
