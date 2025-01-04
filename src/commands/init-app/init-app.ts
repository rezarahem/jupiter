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
import { createBashScripts } from './fn/create-bash-scripts/create-bash-scripts.js';
import { createJupiterignoreFile } from './fn/create-jupiterignore-file.js';

export const InitApp = new Command('initialize-app')
  .alias('init')
  .description(
    'Configures the initial setup for a new application, including its environment and any required configurations.'
  )
  .action(async () => {
    await checkApp();

    await addNextjs();

    const currentDic = process.cwd();

    gitIint();

    await createDockerignore(currentDic);

    createJupiterFile();
    createJupiterignoreFile();

    const userInput = await newAppInputs();

    await addEnvVar({
      directory: currentDic,
      filename: '.jupiter',
      variables: {
        ...userInput,
      },
    });

    await createBashScripts();

    const app = await getAppNameAndPorts();

    await createDockerComposeBase(app);
  });
