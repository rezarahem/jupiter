import { Command } from 'commander';
import { checkbox } from '@inquirer/prompts';
import { checkDeps } from './fn/check-deps.js';

export const AddDep = new Command('add-dep')
  .alias('a')
  .description(
    'Adds dependencies, such as databases or storage, to the current application.'
  )
  .action(async () => {
    const { allowedChoices, depHandlers } = await checkDeps();

    if (allowedChoices.length === 0) {
      console.log('All available dependencies have already been added.');
      process.exit(0);
    }

    const deps = await checkbox({
      message: 'Select dependncies you need',
      choices: allowedChoices,
    });

    for (const dep of deps) {
      const handler = depHandlers[dep];
      if (handler) {
        await handler();
      } else {
        console.log(`No handler found for dependency: ${dep}`);
      }
    }
  });
