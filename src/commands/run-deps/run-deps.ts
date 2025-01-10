import { Command } from 'commander';
import { getComposePath } from './get-compose-path.js';
import ora from 'ora';
import dotenv from 'dotenv';
import { getSshConnection } from '../../utils/get-ssh-connection.js';
import { uploadComposeFile } from './upload-compose-file.js';

export const RunDeps = new Command('run-deps')
  .alias('r')
  .description(
    'Run and manage dependencies required for the application. Useful for services like databases or storage solutions.'
  )
  .action(async () => {
    const result = dotenv.config({ path: '.jupiter' });
    if (result.error) {
      console.error('Failed to load environment variables from .jupiter');
      process.exit(1);
    }
    const app = process.env.APP;
    const spinner = ora('Connecting over ssh...').start();
    const ssh = await getSshConnection();
    try {
      spinner.text = 'Getting Compose path...';
      const path = await getComposePath();
      spinner.text = 'Uploading Compose file...';
      await uploadComposeFile(ssh, app as string, path as string);
      spinner.succeed('Successfully uploaded Compose File');
      console.log('Start running dependencies');
      const result = await ssh.execCommand(
        `APP=${app} ~/jupiter/jux/run-dep.sh`,
        {
          onStdout: chunk => {
            process.stdout.write(chunk.toString());
          },
          onStderr: chunk => {
            process.stderr.write(chunk.toString());
          },
        }
      );

      if (result.code !== 0) {
        throw new Error(`Command failed with exit code ${result.code}`);
      }
    } catch (error) {
      spinner.fail('Failed to run the dependencies');
      console.log(error);
      process.exit(1);
    } finally {
      ssh.dispose();
    }
  });
