import { NodeSSH } from 'node-ssh';
import path, { dirname, join } from 'path';
import { homedir } from 'os';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const ssh = new NodeSSH();

export const createBashScripts = async (update: boolean = false) => {
  try {
    // Load environment variables
    const result = dotenv.config({ path: '.jupiter' });
    if (result.error) {
      console.error('Failed to load environment variables from .jupiter');
      process.exit(1);
    }

    const vpsUsername = process.env.VPS_USERNAME;
    const vpsIP = process.env.VPS_IP;
    const sshPort = process.env.SSH_PORT;
    const sshHandle = process.env.SSH_PRIVATE_KEY_HANDLE;

    if (!vpsUsername || !vpsIP || !sshPort || !sshHandle) {
      console.error('Missing environment variables');
      process.exit(1);
    }

    const privateKeyPath = join(homedir(), '.ssh', sshHandle);

    await ssh.connect({
      host: vpsIP,
      username: vpsUsername,
      port: sshPort,
      privateKey: readFileSync(privateKeyPath, 'utf-8'),
    });

    // Create Jupiter directory if not exists
    const jupiter = 'jupiter';
    const jupiterCmd = `test -d ${jupiter} && echo "exists" || echo "not exists"`;
    const checkJupiter = await ssh.execCommand(jupiterCmd);

    if (checkJupiter.stdout.trim() === 'not exists') {
      const res = await ssh.execCommand(`mkdir -p ${jupiter}`);
      if (res.code === 0) {
        console.log(`Folder ${jupiter} created successfully.`);
      } else {
        console.error(
          `Failed to create folder ${jupiter}. Error: ${res.stderr}`
        );
        process.exit(1);
      }
    }
    
    const jux = 'jux';

    if (update) {
      const juxCmdUp = `test -d ${jux} && echo "exists" || echo "not exists"`;
      const checkJuxUp = await ssh.execCommand(juxCmdUp);

      if (checkJuxUp.stdout.trim() === 'exists') {
        const cmd = `rm -rf ${jux}`;
        const res = await ssh.execCommand(cmd);
        if (res.code === 0) {
        } else {
          console.log('Failed to update scripts');
          process.exit(1);
        }
      }
    }

    const juxCmd = `test -d ${jux} && echo "exists" || echo "not exists"`;
    const checkJux = await ssh.execCommand(juxCmd);

    if (checkJux.stdout.trim() === 'not exists') {
      const res = await ssh.execCommand(`mkdir -p ${jux}`);
      if (res.code === 0) {
        console.log(`Folder ${jux} created successfully.`);
        await uploadToJux(ssh);
      } else {
        console.error(`Failed to create folder ${jux}. Error: ${res.stderr}`);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  } finally {
    ssh.dispose();
  }
};

const getLocalPath = (p: string) => {
  const fileName = fileURLToPath(import.meta.url);
  const dirName = dirname(fileName);
  return path.resolve(dirName, p);
};

const createFileList = (localAlias: string, remoteAlias: string) =>
  ['check-app.sh', 'set-ssl.sh', 'set-reverse-proxy.sh', 'deploy.sh'].map(
    file => ({
      local: getLocalPath(`${localAlias}/${file}`),
      remote: `${remoteAlias}/${file}`,
    })
  );

export const uploadToJux = async (ssh: NodeSSH) => {
  try {
    const localAlias = '../../../../../sh';
    const remoteAlias = './jux';
    const files = createFileList(localAlias, remoteAlias);
    await ssh.putFiles(files);
    const chmodCommands = files.map(file =>
      ssh.execCommand(`chmod +x ${remoteAlias}/${path.basename(file.local)}`)
    );

    await Promise.all(chmodCommands);

    console.log(
      'Successfully uploaded and made the following files executable on Jux:',
      files.map(f => path.basename(f.local)).join(', ')
    );
  } catch (error) {
    console.log(error);
  }
};
