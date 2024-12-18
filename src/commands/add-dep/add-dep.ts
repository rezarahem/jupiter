import { Command } from 'commander';
import { checkbox, Separator } from '@inquirer/prompts';

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
    ];

    const deps = await checkbox({
      message: 'Select dependncies you need',
      choices,
    });


    deps.forEach(async (d) => {
      await handleDep(d)
    })
  });

const handleDep = async (dep: string) => {
  switch (dep) {
    case 'nextjs':
      console.log('nextjs');
      break;
  }
};
