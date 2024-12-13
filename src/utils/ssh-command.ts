import { join } from 'path';
import { homedir } from 'os';
import { Client } from 'ssh2';
import { readFileSync } from 'fs';
import { readConfig } from './read-config.js';

let sshClient: Client | null = null;

const executeCommand = (ssh: Client, command: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ssh.exec(command, (err, stream) => {
      if (err) {
        reject(`Error executing command: ${err}`);
        return;
      }

      stream
        .on('close', (code: number, signal: string) => {
          if (code === 0) {
            resolve();
          } else {
            reject(`Command failed with code ${code} and signal ${signal}`);
          }
        })
        .on('data', (data: Buffer) => {
          console.log('STDOUT:', data.toString());
        })
        .stderr.on('data', (data: Buffer) => {
          console.error('STDERR:', data.toString());
        });
    });
  });
};

export const connectSsh = async (commands: string[]) => {
  const config = readConfig();

  if (!config) {
    console.error('Config not found');
    return;
  }

  const { VPS_IP, SSH_PORT, VPS_USERNAME } = config;

  // Initialize the SSH client only if not already initialized
  if (!sshClient) {
    sshClient = new Client();
    const privateKeyPath = join(homedir(), '.ssh', 'id_ed25519');

    sshClient.on('ready', async () => {
      console.log('SSH Connection established!');
      try {
        // Ensure sshClient is not null here
        if (sshClient) {
          for (const command of commands) {
            await executeCommand(sshClient, command);
          }
          console.log('All commands executed successfully.');
        }
        // Safely check if sshClient is not null before calling end()
        if (sshClient) {
          sshClient.end(); // Close the connection after executing commands
        }
        sshClient = null; // Reset the client after finishing
      } catch (error) {
        console.error(error);
        // Safely check if sshClient is not null before calling end()
        if (sshClient) {
          sshClient.end(); // Ensure the connection is closed on error
        }
        sshClient = null; // Reset the client after an error
      }
    });

    sshClient.on('error', err => {
      console.error('SSH connection error:', err);
      // Safely check if sshClient is not null before calling end()
      if (sshClient) {
        sshClient.end(); // Ensure the connection is closed on error
      }
      sshClient = null; // Reset the client after an error
    });

    sshClient.connect({
      host: VPS_IP,
      port: SSH_PORT,
      username: VPS_USERNAME,
      privateKey: readFileSync(privateKeyPath),
    });
  } else {
    // If the connection is already alive, just execute the commands
    try {
      // Ensure sshClient is not null here
      if (sshClient) {
        for (const command of commands) {
          await executeCommand(sshClient, command);
        }
        console.log('Commands executed on the existing connection.');
      }
      // Safely check if sshClient is not null before calling end()
      if (sshClient) {
        sshClient.end(); // Ensure the connection ends after executing commands
      }
      sshClient = null; // Reset the client
    } catch (error) {
      console.error('Error executing commands:', error);
      // Safely check if sshClient is not null before calling end()
      if (sshClient) {
        sshClient.end(); // Ensure the connection ends after an error
      }
      sshClient = null; // Reset the client
    }
  }
};
