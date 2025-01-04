import { NodeSSH } from 'node-ssh';
import path, { join } from 'path';
import { homedir } from 'os';
import { readFileSync } from 'fs';
import { readFile, readdir } from 'fs/promises';
import dotenv from 'dotenv';
import ora, { Ora } from 'ora';
import { existsSync } from 'fs';

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

    // spinner.text = 'Uploading files...';
    // await ssh.putFiles(uploads);

    spinner.text = 'Uploading files...';
    for (const upload of uploads) {
      spinner.text = `Uploading: ${upload.local}`;
      // console.log(`Uploading: ${upload.local}`); // Log file name
      await ssh.putFile(upload.local, upload.remote);
    }

    spinner.succeed(`Source files uploaded successfully.`);
  } catch (error) {
    spinner.fail('Failed to upload files');
    console.log(error);
  }
};

export const cloneSource = async (update: boolean = false) => {
  const spinner = ora('Uploading directory...').start();
  try {
    const result = dotenv.config({ path: '.jupiter' });
    if (result.error) {
      spinner.fail('Failed to load environment variables from .jupiter');
      process.exit(1);
    }

    const vpsUsername = process.env.VPS_USERNAME;
    const vpsIP = process.env.VPS_IP;
    const sshPort = process.env.SSH_PORT;
    const sshHandle = process.env.SSH_PRIVATE_KEY_HANDLE;
    const app = process.env.APP;

    if (!vpsUsername || !vpsIP || !sshPort || !sshHandle) {
      spinner.fail('Missing environment variables');
      process.exit(1);
    }

    const privateKeyPath = join(homedir(), '.ssh', sshHandle);

    spinner.text = 'Connecting to Host...';

    await ssh.connect({
      host: vpsIP,
      username: vpsUsername,
      port: sshPort,
      privateKey: readFileSync(privateKeyPath, 'utf-8'),
    });

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
