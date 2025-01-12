import { Command } from 'commander';
import { streamCommand } from '../../utils/stream-command.js';
import dotenv from 'dotenv';
import { checkWebApp } from '../../utils/check-web-app.js';
import { validateNextjsDeploy } from './fn/validate-nextjs-deploy.js';

export const Deploy = new Command('deploy')
  .alias('d')
  .description('Deploy the application to the host')
  .action(async () => {
    const web = await checkWebApp();
    switch (web) {
      case 'nextjs':
        const nextCheck = await validateNextjsDeploy();
        if (!nextCheck) process.exit(1);
        break;
      case 'nuxtjs':
        // const nuxtCheck = await validateNuxtjsDeploy();
        break;
    }

    dotenv.config({ path: '.jupiter' });
    const APP = process.env.APP;
    if (!APP) {
      console.error('Missing required variable, App name');
      process.exit(1);
    }

    await streamCommand(`APP=${APP} ~/jupiter/jux/deploy.sh`);
  });
