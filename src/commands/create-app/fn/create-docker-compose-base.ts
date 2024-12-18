// import dotenv from 'dotenv';
import { createFile } from '../../../utils/create-file.js';

export const createDockerComposeBase = async (appName: string) => {
  const content = `networks:
  ${appName}:
    driver: bridge`;

  await createFile({
    content,
    directory: 'docker',
    filename: 'docker-compose.base.yml',
  });
};
