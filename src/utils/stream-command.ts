import { NodeSSH, SSHExecCommandResponse } from 'node-ssh';
import { join } from 'path';
import { homedir } from 'os';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

const ssh = new NodeSSH();

export const streamCommand = async (
  command: string,
  skipLog: boolean = false
): Promise<SSHExecCommandResponse> => {
  try {
    dotenv.config({ path: '.jupiter' });

    const vpsUsername = process.env.VPS_USERNAME;
    const vpsIP = process.env.VPS_IP;
    const sshPort = process.env.SSH_PORT;

    const privateKeyPath = join(homedir(), '.ssh', 'id_ed25519');

    await ssh.connect({
      host: vpsIP,
      username: vpsUsername,
      port: sshPort,
      privateKey: readFileSync(privateKeyPath, 'utf-8'),
    });

    const result = skipLog
      ? await ssh.execCommand(command)
      : await ssh.execCommand(command, {
          onStdout: chunk => process.stdout.write(chunk.toString()),
          onStderr: chunk => process.stderr.write(chunk.toString()),
        });

    if (result.code !== 0) {
      throw new Error(`Command failed with exit code ${result.code}`);
    }

    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    ssh.dispose();
  }
};
