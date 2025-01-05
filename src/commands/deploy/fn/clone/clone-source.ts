import ora, { Ora } from 'ora';
import { getSshConnection } from '../../../../utils/get-ssh-connection.js';
import { getFiles } from './get-files.js';

export const cloneSource = async (app: string) => {
  const spinner = ora('Uploading directory...').start();
  spinner.text = 'Connecting to Host...';
  const ssh = await getSshConnection();
  try {
    const remoteDir = `./jupiter/${app}`;
    const up = await getFiles(remoteDir)

    spinner.text = 'Uploading files...';
    await ssh.putFiles(up)
    spinner.succeed(`Source files uploaded successfully.`);
  } catch (error) {
    spinner.fail('Error occurred');
    console.log(error);
    process.exit(1);
  } finally {
    ssh.dispose();
  }
};
