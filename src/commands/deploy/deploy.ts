import { Command } from 'commander';
import { createFolder } from './create-folder.js';

export const Deploy = new Command('deploy').action(() => {
  createFolder();
});
