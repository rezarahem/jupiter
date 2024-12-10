import { createFile } from '../../utils/create-file.js';

type CreateConfigFileProps = {
  directory: string;
  app: string;
  domain: string;
  email: string;
  privateConnectionUrl: string;
};
export const createConfigFile = async ({
  app,
  directory,
  domain,
  email,
  privateConnectionUrl,
}: CreateConfigFileProps) => {
  const juConfig = {
    dir: app,
    image: app,
    net: app,
    email,
    domain,
    privateConnectionUrl,
  };
  const content = JSON.stringify(juConfig, null, 2);
  const filename = 'jupiter.config.json';
  await createFile({ directory, filename, content });
};
