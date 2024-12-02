import { Command } from 'commander';

export const AddGithubAction = new Command('git').action(() => {
  console.log('git');
});

