import { NodeSSH } from 'node-ssh';
import { join } from 'path';
import { homedir } from 'os';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
export type ShFile = {
  content: string;
  path: string;
  chmod?: boolean;
  folder?: boolean;
};

const ssh = new NodeSSH();

export const createFilesOverSSH = async (files: ShFile[]) => {
  try {
    dotenv.config({ path: '.jupiter' });
    const vpsUsername = process.env.VPS_USERNAME;
    const vpsIP = process.env.VPS_IP;
    const sshPort = process.env.SSH_PORT;
    const sshHandle = process.env.SSH_PRIVATE_KEY_HANDLE;

    if (!sshHandle) process.exit(1);

    const privateKeyPath = join(homedir(), '.ssh', sshHandle);

    await ssh.connect({
      host: vpsIP,
      username: vpsUsername,
      port: sshPort,
      privateKey: readFileSync(privateKeyPath, 'utf-8'),
    });

    for (const file of files) {
      const { content, path, chmod, folder } = file;

      // Check if it's a folder
      if (folder) {
        // Create the folder (if not exists)
        const folderExists = await ssh.execCommand(
          `test -d ${path} && echo "exists" || echo "not exists"`
        );
        if (folderExists.stdout.includes('not exists')) {
          await ssh.execCommand(`mkdir -p ${path}`);
          console.log(`Folder created: ${path}`);
        }
      } else {
        // Check if the file exists
        const fileExists = await ssh.execCommand(
          `test -f ${path} && echo "exists" || echo "not exists"`
        );
        if (fileExists.stdout.includes('not exists')) {
          // Create the file with content
          await ssh.putFile(path, content);
          console.log(`File created: ${path}`);

          // Apply chmod +x if the flag is set
          if (chmod) {
            await ssh.execCommand(`chmod +x ${path}`);
            console.log(`Chmod +x applied to: ${path}`);
          }
        } else {
          console.log(`File already exists: ${path}`);
        }
      }
    }
  } catch (error) {
    console.log('Error creating files over SSH:', error);
  } finally {
    ssh.dispose();
  }
};
