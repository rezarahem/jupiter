import { Command } from 'commander';
import { checkApp } from '../../utils/check-app.js';
import { streamCommand } from '../../utils/stream-command.js';
import dotenv from 'dotenv';
import { hasServices } from './fn/has-service.js';
import { cloneSource } from './fn/clone/clone-source.js';
import { getFiles } from './fn/clone/get-files.js';

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
    const VPS_USERNAME = process.env.VPS_USERNAME;
    const VPS_IP = process.env.VPS_IP;
    const SSH_PORT = process.env.SSH_PORT;
    const EMAIL = process.env.EMAIL;
    const DOMAIN = process.env.DOMAIN;
    // const REPO = process.env.REPO;
    const APOLLO = process.env.APOLLO;
    const ARTEMIS = process.env.ARTEMIS;
    const DOCKER_COMPOSE = hasServices() ? '1' : '0';
    if (
      !APP ||
      !VPS_USERNAME ||
      !VPS_IP ||
      !SSH_PORT ||
      !EMAIL ||
      !DOMAIN ||
      // !REPO ||
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
        // REPO,
        APOLLO,
        ARTEMIS,
        DOCKER_COMPOSE,
        MANUAL,
      },
    });

    await cloneSource(APP);
    // if (MANUAL === '1') {
    // }

    // await streamCommand(cmd);
  });
