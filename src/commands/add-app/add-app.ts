import { Command } from 'commander';
import { gitIint } from './fn/git-init.js';
import { createJupiterFile } from './fn/create-jupiter-file.js';
import { newAppInputs } from './fn/get-user-input.js';
import { addEnvVar } from '../../utils/add-env-var.js';
import { getAppName } from './fn/get-app-name.js';

export const AddApp = new Command('add-app')
  .alias('a')
  .description('Creates a new app configuration for deployment.')
  .action(async () => {
    const currentDic = process.cwd();

    gitIint();

    createJupiterFile();

    const userInput = await newAppInputs();

    await addEnvVar({
      directory: currentDic,
      variables: {
        ...userInput,
        TECH: 'nextjs',
      },
    });

    await getAppName();
  });
