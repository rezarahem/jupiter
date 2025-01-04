import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import ora, { Ora } from 'ora';
import { NodeSSH } from 'node-ssh';
import { getSshConnection } from '../../../../utils/get-ssh-connection.js';

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

const uploadToJux = async (ssh: NodeSSH, spinner: Ora) => {
  try {
    spinner.text = 'Uploading scripts...';

    const localAlias = '../../../../../sh';
    const remoteAlias = './jux';

    const files = createFileList(localAlias, remoteAlias);

    await ssh.putFiles(files);

    const chmodCommands = files.map(file =>
      ssh.execCommand(`chmod +x ${remoteAlias}/${path.basename(file.local)}`)
    );

    await Promise.all(chmodCommands);

    spinner.succeed(
      'Successfully uploaded and made the following files executable on Jux: ' +
        files.map(f => path.basename(f.local)).join(', ')
    );
  } catch (error) {
    spinner.fail('Failed to upload scripts');
    console.log(error);
  }
};
const ssh = await getSshConnection();

export const createBashScripts = async (update: boolean = false) => {
  const spinner = ora('Uploading scripts...').start();
  try {
    const jupiter = 'jupiter';
    const jupiterCmd = `test -d ${jupiter} && echo "exists" || echo "not exists"`;
    const checkJupiter = await ssh.execCommand(jupiterCmd);

    if (checkJupiter.stdout.trim() === 'not exists') {
      spinner.text = `Creating folder ${jupiter}...`;
      const res = await ssh.execCommand(`mkdir -p ${jupiter}`);
      if (res.code === 0) {
        spinner.text = `Folder ${jupiter} created successfully.`;
      } else {
        spinner.fail(
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
        spinner.text = `Updating folder ${jux}...`;
        const cmd = `rm -rf ${jux}`;
        const res = await ssh.execCommand(cmd);
        if (res.code !== 0) {
          spinner.fail('Failed to update scripts');
          process.exit(1);
        }
      }
    }

    const juxCmd = `test -d ${jux} && echo "exists" || echo "not exists"`;
    const checkJux = await ssh.execCommand(juxCmd);

    if (checkJux.stdout.trim() === 'not exists') {
      spinner.text = `Creating folder ${jux}...`;
      const res = await ssh.execCommand(`mkdir -p ${jux}`);
      if (res.code === 0) {
        spinner.text = `Folder ${jux} created successfully.`;
        await uploadToJux(ssh, spinner);
      } else {
        spinner.fail(`Failed to create folder ${jux}. Error: ${res.stderr}`);
        process.exit(1);
      }
    } else {
      spinner.succeed('Bash scripts already exists.');
    }
  } catch (error) {
    spinner.fail('Error occurred');
    console.log(error);
    process.exit(1);
  } finally {
    ssh.dispose();
  }
};
