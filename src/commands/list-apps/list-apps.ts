import { Command } from 'commander';
import ora from 'ora';
import { streamCommand } from '../../utils/stream-command.js';

export const ListApps = new Command('list-apps')
  .alias('ls')
  .description('Lists all the apps available in the Jupiter project directory.')
  .action(async () => {
    const spinner = ora(`Listing the apps...`).start();

    try {
      const res = await streamCommand('ls -1 jupiter/', true);
      spinner.succeed('Listing the apps...');
      console.log();
      console.log(res.stdout);
    } catch (error) {
      spinner.fail('Failed to list the apps');
    }
  });
