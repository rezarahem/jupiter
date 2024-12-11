import { createFile } from '../../utils/create-file.js';


type CreateConfigFileProps = {
  directory: string;
  app: string;
  [key: string]: string | unknown;
};
export const createConfigFile = async ({
  app,
  directory,
  ...configProps
}: CreateConfigFileProps) => {
  const juConfig = {
    dir: app,
    image: app,
    net: app,
    ...configProps,
  };
  const content = JSON.stringify(juConfig, null, 2);
  const filename = 'jupiter.config.json';
  await createFile({ directory, filename, content });
};
