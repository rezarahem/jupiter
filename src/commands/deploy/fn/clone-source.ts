import { NodeSSH } from 'node-ssh';
import path, { join } from 'path';
import { homedir } from 'os';
import { readFileSync } from 'fs';
import { readFile, readdir } from 'fs/promises';
import dotenv from 'dotenv';
import ora, { Ora } from 'ora';
import { existsSync } from 'fs';
import { getSshConnection } from '../../../utils/get-ssh-connection.js';

const ssh = new NodeSSH();

const getIgnorePatterns = async (): Promise<string[]> => {
  const ignoreFile = '.jupiterignore';
  if (!existsSync(ignoreFile)) return [];
  const content = await readFile(ignoreFile, 'utf-8');
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));
};

const getFiles = async (
  dir: string,
  ignorePatterns: string[]
): Promise<string[]> => {
  const files: string[] = [];
  const items = await readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      const subFiles = await getFiles(fullPath, ignorePatterns);
      files.push(...subFiles);
    } else if (!ignorePatterns.some(pattern => fullPath.includes(pattern))) {
      files.push(fullPath);
    }
  }

  return files;
};

const upload = async (ssh: NodeSSH, spinner: Ora, remoteDir: string) => {
  try {
    spinner.text = 'Gathering files to upload...';
    const ignorePatterns = await getIgnorePatterns();

    const files = await getFiles('.', ignorePatterns);

    const uploads = files.map(file => ({
      local: path.resolve(file),
      remote: join(remoteDir, file),
    }));

    spinner.text = 'Uploading files...';
    await ssh.putFiles(uploads)

    spinner.succeed(`Source files uploaded successfully.`);
  } catch (error) {
    spinner.fail('Failed to upload files');
    console.log(error);
  }
};

export const cloneSource = async (app: string) => {
  const spinner = ora('Uploading directory...').start();
  spinner.text = 'Connecting to Host...';
  const ssh = await getSshConnection();
  try {
    const remoteDir = `./jupiter/${app}`;
    await upload(ssh, spinner, remoteDir);
  } catch (error) {
    spinner.fail('Error occurred');
    console.log(error);
    process.exit(1);
  } finally {
    ssh.dispose();
  }
};
