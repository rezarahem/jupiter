import { NodeSSH } from 'node-ssh';
import { readConfig } from './read-config.js';
import { join } from 'path';
import { homedir } from 'os';
import { readFileSync } from 'fs';

const ssh = new NodeSSH();

export const streamMultiCommands = async (
  commands: string[]
): Promise<void> => {
  try {
    const config = readConfig();

    if (!config) {
      console.error('Config not found');
      return;
    }

    const { vpsIp, sshPort, vpsUsername } = config;

    const privateKeyPath = join(homedir(), '.ssh', 'id_ed25519');

    console.log(`Connecting to ${vpsIp}...`);

    await ssh.connect({
      host: vpsIp,
      username: vpsUsername,
      port: sshPort,
      privateKey: readFileSync(privateKeyPath, 'utf-8'),
    });

    for (const command of commands) {
      console.log(`Executing: ${command}`);

      const result = await ssh.execCommand(command, {
        onStdout: chunk => process.stdout.write(chunk.toString()),
        onStderr: chunk => process.stderr.write(chunk.toString()),
      });

      if (result.code !== 0) {
        console.error(`Command failed: ${command}`);
        console.error(`Error: ${result.stderr}`);
        throw new Error(`Command failed with exit code ${result.code}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    ssh.dispose();
    console.log('Connection closed.');
  }
};
