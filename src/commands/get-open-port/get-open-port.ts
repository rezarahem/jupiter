import { Command } from 'commander';
import { getSshConnection } from '../../utils/get-ssh-connection.js';
import ora from 'ora';
import { userInput } from '../../utils/user-input.js';
import { portNumber } from '../../zod/index.js';

export const GetOpenPort = new Command('get-open-port')
  .alias('op')
  .description('Fetches an open port from a remote host over SSH.')
  .action(async () => {
    const spinner = ora().start('Connecting to Host over SSH...');
    const ssh = await getSshConnection();
    try {
      spinner.succeed('Successfully connected to the host over SSH!');

      const portNum = await userInput({
        defaultValue: '1',
        prompt: 'How many ports do you need: ',
        schema: portNumber,
      });

      const jux = '$HOME/jupiter/jux';

      spinner.start('Getting ports over SSH...');
      const res = await ssh.execCommand(`${jux}/open-port.sh ${portNum}`);

      if (res.code !== 0) {
        spinner.fail();
      }
      spinner.succeed('Successfully obtained open ports');

      res.stdout.split(':').forEach((p, i) => {
        console.log(`port ${i + 1}: ${p}`);
      });
    } catch (error) {
      spinner.fail();
      console.log(error);
    } finally {
      ssh.dispose();
    }
  });
