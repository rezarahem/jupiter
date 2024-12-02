#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program.action(() => {
  console.log('commander');
});

program.parse(process.argv);
