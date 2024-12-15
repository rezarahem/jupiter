import { streamMultiCommands } from '../../../utils/stream-multi-commands.js';

export const downloadScripts = async () => {
  const link =
    'https://github.com/rezarahem/jupiter-cli/blob/main/sh/scripts.tar.gz';
  const file = 'scripts.tar.gz';

  const cmds = [
    `curl -o ${file} -L ${link}`,
    `if [ $? -eq 0 ]; then echo "Downloaded successfully to ${file}."; else echo "Failed to download file."; exit 1; fi`,
    `echo "Extracting ${file} to the current directory..."`,
    `tar -xzf ${file}`,
    `if [ $? -eq 0 ]; then echo "Extraction completed successfully."; rm ${file}; else  echo "Extraction failed."; exit 1; fi`,
  ];

  await streamMultiCommands(cmds);
};
