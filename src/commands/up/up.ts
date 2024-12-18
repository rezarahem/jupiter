import { Command } from 'commander';
import { streamCommand } from '../../utils/stream-command.js';

export const up = new Command('up')
  .alias('u')
  .description(
    'Updates Ubuntu packages and installs Docker, Nginx, and other essential dependencies for the host.'
  )
  .action(async () => {
    console.log('Starting the update process...');
    try {
      await streamCommand('bash ./jux/up.sh');
      console.log('Update process completed successfully.');
    } catch (error) {
      console.error('An error occurred during the update process:', error);
    }
  });
