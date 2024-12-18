import { Command } from 'commander';

export const AddDep = new Command('add-dep')
  .alias('a')
  .description(
    'Adds dependencies, such as databases or storage, to the current application.'
  )
  .action(async () => {
    // Command logic here
  });
