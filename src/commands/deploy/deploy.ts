import { Command } from 'commander';
import { createFolder } from './create-folder.js';

export const deploy = new Command('deploy').action(() => {
  createFolder();
});
