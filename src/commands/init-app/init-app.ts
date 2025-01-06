import { Command } from 'commander';
import { gitIint } from './fn/git-init.js';
import { createJupiterFile } from './fn/create-jupiter-file.js';
import { newAppInputs } from './fn/get-user-input.js';
import { addEnvVar } from '../../utils/add-env-var.js';
import { getAppNameAndPorts } from './fn/get-app-name-and-ports.js';
import { createDockerignore } from './fn/create-dockerignore.js';
import { createDockerComposeBase } from './fn/create-docker-compose-base.js';
import { addNextjs } from './fn/add-next/add-nextjs.js';
import { checkWebApp } from '../../utils/check-web-app.js';
import { updateScripts } from '../update-host/fn/update-scripts.js';
import { generateAppConfig } from './fn/generate-app-config.js';

export const InitApp = new Command('initialize-app')
  .alias('init')
  .description(
    'Configures the initial setup for a new application, including its environment and any required configurations.'
  )
  .action(async () => {
    // const currentDic = process.cwd();

    const web = await checkWebApp();

    // switch (web) {
    //   case 'nextjs':
    //     await addNextjs();
    //     break;
    //   case 'nuxtjs':
    //     // await addNuxtjs();
    //     break;
    // }

    const userInput = await newAppInputs();

    const app = await generateAppConfig({
      ...userInput,
      web,
    });

    // get app name
    // stream cmd
    // 1. check for scripts if not upload
    // 2. check for app name and port if not ask for app nema again and create the config
    // 3. update config with user input
    // 4. enc stream cmd
    // create .jupier with with source config
    // fi

    // await updateScripts(true);
    // gitIint();
    // createJupiterFile();
    // const app = await getAppNameAndPorts(userInput);

    // await addEnvVar({
    //   directory: currentDic,
    //   filename: '.jupiter',
    //   variables: {
    //     ...userInput,
    //   },
    // });

    // await createDockerignore(currentDic);
    // await createDockerComposeBase(app);
  });
