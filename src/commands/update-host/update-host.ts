import { Command } from 'commander';
import { createBashScripts } from '../init-app/fn/create-bash-scripts/create-bash-scripts.js';

export const UpdateHost = new Command('update-host')
  .alias('up')
  .description('Updates the bash scripts on the remote VPS.')
  .action(async () => {
    
    await createBashScripts(true);
  });
