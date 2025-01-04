import { Command } from 'commander';
import { checkApp } from '../../utils/check-app.js';
import { streamCommand } from '../../utils/stream-command.js';
import dotenv from 'dotenv';
import { hasServices } from './fn/has-service.js';
import { cloneSource } from './fn/clone-source.js';

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
    const DOCKER_COMPOSE = hasServices() ? '1' : '0';
    if (
      !APP ||
      !EMAIL ||
      !DOMAIN ||
      !REPO ||
      !APOLLO ||
      !ARTEMIS ||
      !WEB ||
      !DOCKER_COMPOSE
    ) {
      console.error(
        'Missing required environment variables: APP, EMAIL, or DOMAIN'
      );
      process.exit(1);
    }

    const MANUAL = '1';

    const cmd = command({
      variables: {
        APP,
        EMAIL,
        DOMAIN,
        WEB,
        REPO,
        APOLLO,
        ARTEMIS,
        DOCKER_COMPOSE,
        MANUAL,
      },
    });

    if (MANUAL === '1') {
      await cloneSource();
    }

    await streamCommand(cmd);
  });
