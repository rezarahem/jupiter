import { Command } from 'commander';
import { checkbox } from '@inquirer/prompts';
import { addNextjs } from './fn/add-nextjs.js';
import { addPostgres } from './fn/add-postgres.js';

const depHandlers: { [key: string]: () => Promise<void> } = {
  nextjs: addNextjs,
  postgres: addPostgres,
};

export const AddDep = new Command('add-dep')
  .alias('a')
  .description(
    'Adds dependencies, such as databases or storage, to the current application.'
  )
  .action(async () => {
    const choices = [
      {
        name: 'Nextjs',
        value: 'nextjs',
      },
      {
        name: 'PostgreSQL',
        value: 'postgres',
      },
    ];

    const deps = await checkbox({
      message: 'Select dependncies you need',
      choices,
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
