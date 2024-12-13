import { join } from 'path';
import { readConfig } from '../../utils/read-config.js';
import { homedir } from 'os';
import { Client } from 'ssh2';
import { readFileSync } from 'fs';

export const createFolder = () => {
  const config = readConfig();

  if (!config) return;

  const { VPS_IP, SSH_PORT, VPS_USERNAME } = config;

  const ssh = new Client();

  const privateKeyPath = join(homedir(), '.ssh', 'id_ed25519');

  const folderName = 'app';

  ssh
    .on('ready', () => {
      console.log('SSH Connection established!');

      // Command to create the folder
      const command = `mkdir -p ~/${folderName}`;

      ssh.exec(command, (err, stream) => {
        if (err) {
          console.error('Error executing command:', err);
          return;
        }

        stream
          .on('close', (code: number, signal: string) => {
            if (code === 0) {
              console.log(
                `Folder "${folderName}" created successfully on the VPS!`
              );
            } else {
              console.error(
                `Command failed with code ${code} and signal ${signal}`
              );
            }
            ssh.end();
          })
          .on('data', (data: Buffer) => {
            console.log('STDOUT:', data.toString());
          })
          .stderr.on('data', (data: Buffer) => {
            console.error('STDERR:', data.toString());
          });
      });
    })
    .connect({
      host: VPS_IP,
      port: SSH_PORT,
      username: VPS_USERNAME,
      privateKey: readFileSync(privateKeyPath),
    });
};
