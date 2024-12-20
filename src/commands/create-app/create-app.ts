import { Command } from 'commander';
import { gitIint } from './fn/git-init.js';
import { createJupiterFile } from './fn/create-jupiter-file.js';
import { newAppInputs } from './fn/get-user-input.js';
import { addEnvVar } from '../../utils/add-env-var.js';
import { getAppName } from './fn/get-app-name.js';
import { createDockerignore } from './fn/create-dockerignore.js';
import { createDockerComposeBase } from './fn/create-docker-compose-base.js';
import { isNextJsProject } from '../../utils/is-nextjs-project.js';
import { addNextjs } from '../add-dep/fn/add-nextjs.js';

export const CreateApp = new Command('create-app')
  .alias('c')
  .description(
    'Configures the initial setup for a new application, including its environment and any required configurations.'
  )
  .action(async () => {
    if (!isNextJsProject()) {
      console.log(
        'Jupiter currently only supports Next.js projects. Please create a Next.js app using the command: npx create-next-app'
      );
      process.exit(1);
    }

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

    const app = await getAppName();

    await createDockerComposeBase(app);
  });
