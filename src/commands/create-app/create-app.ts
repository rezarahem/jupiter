import { Command } from 'commander';
import { gitIint } from './fn/git-init.js';
import { createJupiterFile } from './fn/create-jupiter-file.js';
import { newAppInputs } from './fn/get-user-input.js';
import { addEnvVar } from '../../utils/add-env-var.js';
import { getAppNameAndPorts } from './fn/get-app-name-and-ports.js';
import { createDockerignore } from './fn/create-dockerignore.js';
import { createDockerComposeBase } from './fn/create-docker-compose-base.js';
import { addNextjs } from './fn/add-next/add-nextjs.js';
import { checkApp } from '../../utils/check-app.js';

export const CreateApp = new Command('create-app')
  .alias('c')
  .description(
    'Configures the initial setup for a new application, including its environment and any required configurations.'
  )
  .option(
    '-n, --nextjs',
    'Only add Next.js configurations, skip other configurations'
  )
  .action(async options => {
    if (options.nextjs) {
      await addNextjs();
      console.log('Nextjs configs added successfully');
      process.exit(0);
    }

    await checkApp();

    await addNextjs();

    const currentDic = process.cwd();

    gitIint();

    await createDockerignore(currentDic);

    createJupiterFile();

    const userInput = await newAppInputs();

    await addEnvVar({
      directory: currentDic,
      variables: {
        ...userInput,
      },
    });

    const app = await getAppNameAndPorts();

    await createDockerComposeBase(app);
  });
