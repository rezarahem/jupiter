import { Command } from 'commander';
import { checkApp } from '../../utils/check-app.js';
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
    const WEB = await checkApp();
    dotenv.config({ path: '.jupiter' });

    const APP = process.env.APP;
    const EMAIL = process.env.EMAIL;
    const DOMAIN = process.env.DOMAIN;
    const REPO = process.env.REPO;
    const APOLLO = process.env.APOLLO;
    const ARTEMIS = process.env.ARTEMIS;

    if (!APP || !EMAIL || !DOMAIN || !REPO || !APOLLO || !ARTEMIS || !WEB) {
      console.error(
        'Missing required environment variables: APP, EMAIL, or DOMAIN'
      );
      process.exit(1);
    }

    const cmd = command({
      variables: { APP, EMAIL, DOMAIN, WEB, REPO, APOLLO, ARTEMIS },
    });

    await streamCommand(cmd);
  });
