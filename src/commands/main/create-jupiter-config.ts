import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { createFile } from '../../utils/create-file.js';

type CreateConfigFileProps = {
  directory: string;
  app: string;
  domain: string;
  email: string;
};
export const createConfigFile = async ({
  app,
  directory,
  domain,
  email,
}: CreateConfigFileProps) => {
  const juConfig = {
    dir: app,
    image: app,
    net: app,
    email,
    domain,
  };
  const configContent = JSON.stringify(juConfig, null, 2);
  const filename = 'jupiter.config.json';
  await createFile(directory, filename, configContent);
};
