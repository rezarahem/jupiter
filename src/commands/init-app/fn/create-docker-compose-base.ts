import { createFile } from '../../../utils/create-file.js';
import yaml from 'yaml';

export const createDockerComposeBase = async (appName: string) => {
 const content = yaml.stringify({
  networks: {
   [appName]: {
    name: appName,
    external: true,
    driver: 'bridge',
   },
  },
 });

 await createFile({
  content,
  directory: `${process.cwd()}/deps`,
  filename: 'docker-compose.yml',
 });
};
