import { Command } from 'commander';
import { addNextjs } from '../add-dep/fn/add-next/add-nextjs.js';

export const nc = new Command('nc').action(async () => {
  await addNextjs();
});
