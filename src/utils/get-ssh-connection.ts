import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

export const getSshConnection = async () => {
  const result = dotenv.config({ path: '.jupiter' });
  if (result.error) {
    console.error('Failed to load environment variables from .jupiter');
    process.exit(1);
  }

  const vpsUsername = process.env.VPS_USERNAME;
  const vpsIP = process.env.VPS_IP;
  const sshPort = process.env.SSH_PORT;

  if (!vpsUsername || !vpsIP || !sshPort) {
    console.error('Missing environment variables');
    process.exit(1);
  }

  const sshKeys = ['id_ed25519', 'rsa'];
  let privateKeyPath: string | null = null;

  for (const key of sshKeys) {
    const keyPath = join(homedir(), '.ssh', key);
    if (existsSync(keyPath)) {
      privateKeyPath = keyPath;
      break;
    }
  }

  if (!privateKeyPath) {
    console.error('No SSH private key found in ~/.ssh/ for rsa or id_ed25519');
    process.exit(1);
  }

  await ssh.connect({
    host: vpsIP,
    username: vpsUsername,
    port: sshPort,
    privateKey: readFileSync(privateKeyPath, 'utf-8'),
  });

  return ssh;
};
