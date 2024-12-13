import { createFile } from '../../utils/create-file.js';

type CreateConfigFileProps = {
  directory: string;
  [key: string]: string | unknown;
};
export const createConfigFile = async ({
  directory,
  ...configProps
}: CreateConfigFileProps) => {
  const content = Object.entries(configProps)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key.toUpperCase()}="${value}"`;
      }
      return `${key.toUpperCase()}=${JSON.stringify(value)}`;
    })
    .join('\n');

  const filename = 'config.sh';
  await createFile({ directory, filename, content });
};
