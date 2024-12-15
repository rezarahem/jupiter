import { createFile } from '../../../utils/create-file.js';

type CreateConfigFileProps = {
  directory: string;
  [key: string]: string | unknown;
};
export const createConfigFile = async ({
  directory,
  ...configProps
}: CreateConfigFileProps) => {
  const juConfig = {
    ...configProps,
  };
  const content = JSON.stringify(juConfig, null, 2);
  const filename = 'jupiter.config.json';
  await createFile({ directory, filename, content });
};
