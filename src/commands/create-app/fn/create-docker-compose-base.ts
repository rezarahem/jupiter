import { createFile } from '../../../utils/create-file.js';
import yaml from 'yaml';

export const createDockerComposeBase = async (appName: string) => {
  const content = yaml.stringify({
    networks: {
      [appName]: {
        driver: 'bridge',
      },
    },
  });

  await createFile({
    content,
    directory: process.cwd(),
    filename: 'docker-compose.yml',
  });
};
