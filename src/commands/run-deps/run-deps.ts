import { Command } from 'commander';
import { getComposePath } from './fn/get-compose-path.js';
import ora from 'ora';
import dotenv from 'dotenv';
import { getSshConnection } from '../../utils/get-ssh-connection.js';
import { uploadComposeFile } from './fn/upload-compose-file.js';
import { isComposeOk } from './fn/is-compose-ok.js';
import { getDepsPath } from './fn/get-deps.js';

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
  console.log('Checking docker compose validity...');
  const app = process.env.APP;
  if (!app) {
   console.log('No App name found.');
   process.exit(1);
  }

  const { deps, dockerComposePath } = await getDepsPath();

  if (!dockerComposePath) {
   console.log('No Compose file was found.');
   process.exit(1);
  }

  const isDCOk = isComposeOk(dockerComposePath, app);

  if (!isDCOk) process.exit(1);

  const spinner = ora().start('Connecting over ssh...');
  const ssh = await getSshConnection();
  try {
   spinner.text = 'Uploading Compose file...';
   await uploadComposeFile(ssh, app, deps);
   spinner.succeed('Successfully uploaded Compose File');
   console.log('Start running dependencies...');
   const result = await ssh.execCommand(`APP=${app} ~/jupiter/jux/run-dep.sh`, {
    onStdout: (chunk) => {
     process.stdout.write(chunk.toString());
    },
    onStderr: (chunk) => {
     process.stderr.write(chunk.toString());
    },
   });

   if (result.code !== 0) {
    console.log('Command failed');
    process.exit(1);
   }
  } catch (error) {
   spinner.fail();
   console.log(error);
   process.exit(1);
  } finally {
   ssh.dispose();
  }
 });
