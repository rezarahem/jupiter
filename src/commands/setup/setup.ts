import { Command } from 'commander';
import { connectSsh } from '../../utils/ssh-command.js';

export const Setup = new Command('setup-vps').alias('sv').action(async () => {
  const c = [
    'URL="https://raw.githubusercontent.com/rezarahem/jupiter-core/refs/heads/sh/scripts.tar.gz"',
    'FILE="scripts.tar.gz"',
    'echo "Downloading $URL..."',
    'curl -o "$FILE" -L "$URL"',
    'echo "Extracting $FILE to the current directory..."',
    'tar -xzf "$FILE"',
    'rm "$FILE"',
  ];

  await connectSsh(c);
});
