import fs from 'fs';
import yaml from 'yaml';
import { createDockerComposeBase } from '../commands/create-app/fn/create-docker-compose-base.js';
import { createFile } from './create-file.js';
import path from 'path';

export const updateDockerCompose = async (
  app: string,
  configContent: string
) => {
  // 0
  const filePath = path.join(process.cwd(), 'docker-compose.yml');
  if (!fs.existsSync(filePath)) {
    await createDockerComposeBase(app);
  }

  // 1
  let fileContent = fs.readFileSync(filePath, 'utf8');
  const doc = yaml.parse(fileContent);

  const content = yaml.stringify({
    ...yaml.parse(configContent),
    ...doc,
  });

  await createFile({
    directory: process.cwd(),
    content,
    filename: 'docker-compose.yml',
    force: true,
  });
};
