import { NodeSSH } from 'node-ssh';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { userInput } from '../../../utils/user-input.js';
import { appNameSchema } from '../../../zod/index.js';
import ora from 'ora';
import { capitalizeFirstLetter } from '../../../utils/capitalize-first-letter.js';
const jux = '~/jupiter/jux';
type props = {
  repo: string;
  vpsIp: string;
  sshPort: string;
  email: string;
  domain: string;
  vpsUsername: string;
  web: string;
};

const SSH = new NodeSSH();
const getConnected = async (username: string, host: string, port: string) => {
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

  return SSH.connect({
    host,
    username,
    port,
    privateKey: readFileSync(privateKeyPath, 'utf-8'),
  });
};

export const generateAppConfig = async ({
  domain,
  email,
  repo,
  web,
  sshPort,
  vpsIp,
  vpsUsername,
}: props) => {
  const spinner = ora('Connecting to Host...').start();
  const ssh = await getConnected(vpsUsername, vpsIp, sshPort);
  let shouldBreak = false;
  let app: string;
  let apollo: string = '';
  let artemis: string = '';
  try {
    do {
      spinner.stop();
      app = await userInput({
        prompt: "What's your project called: ",
        schema: appNameSchema,
      });

      const checkAppCmd = `bash -c "bash ${jux}/check-app.sh ${app.toLowerCase()}"`;

      try {
        const res = (await ssh.execCommand(checkAppCmd)).stdout;
        const code = res.split('@')[0];
        switch (code) {
          case '409':
            console.log(
              `The app name "${capitalizeFirstLetter(
                app
              )}" is already in use. Please choose a different name.`
            );
            break;
          case '200':
            const ports = res.split('@')[1]?.split(':');
            apollo = ports?.[0] as string;
            artemis = ports?.[1] as string;
            console.log(
              `The app ${capitalizeFirstLetter(app)} name is available.`
            );
            shouldBreak = true;
            break;
          case '206':
            spinner.fail('No available ports found within the defined range.');
            shouldBreak = true;
            break;
        }
      } catch (error) {
        spinner.fail();
        console.log(error);
        process.exit(1);
      }

      if (shouldBreak) {
        break;
      }
    } while (true);
    const variables = {
      APP: app,
      EMAIL: email,
      DOMAIN: domain,
      WEB: web,
      APOLLO: apollo,
      ARTEMIS: artemis,
      REPO: repo,
    };
    const envVars = Object.entries(variables)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');
    const cmd = `${envVars} bash ${jux}/generate-app-conf.sh`;
    spinner.start('Generating the conf...');
    await ssh.execCommand(cmd, {
      cwd: '$HOME',
      onStdout(chunk) {
        console.log('stdoutChunk', chunk.toString('utf8'));
        spinner.succeed('Config file was created successfull');
      },
      onStderr(chunk) {
        console.log('stderrChunk', chunk.toString('utf8'));
        spinner.fail();
      },
    });
    return app.toLowerCase();
  } catch (error) {
    console.log(error);
  } finally {
    ssh.dispose();
  }
};
