import { Command } from 'commander';
import { createBashScripts } from '../create-app/fn/create-bash-scripts/create-bash-scripts.js';

export const UpdateHost = new Command('update-scripts')
  .alias('us')
  .description('Updates the bash scripts on the remote VPS.')
  .action(async () => {
    await createBashScripts();
  });
