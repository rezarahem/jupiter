import { Command } from 'commander';
import { updateScripts } from './fn/update-scripts.js';

export const UpdateHost = new Command('update-host')
  .alias('up')
  .description('Updates the bash scripts on the remote HOST.')
  .action(async () => {
    await updateScripts(true);
  });
