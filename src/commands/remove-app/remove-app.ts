import { Command } from 'commander';
import { appNameSchema } from '../../zod/index.js';
import ora from 'ora';
import { capitalizeFirstLetter } from '../../utils/capitalize-first-letter.js';
import { streamCommand } from '../../utils/stream-command.js';

export const RemoveApp = new Command('remove-app')
  .alias('rm')
  .description(
    'Remove an app from the Host, along with its associated dependencies and configurations.'
  )
  .argument('<app>', 'The name of the app to remove')
  .action(async (app: string) => {
    let res: string;

    try {
      appNameSchema.parse(app);
    } catch (error) {
      console.log('Invalid app name.');
      process.exit(1);
    }

    const spinner = ora(
      `Checking if the app name "${capitalizeFirstLetter(app)}" exists...\n`
    ).start();

    try {
      res = (
        await streamCommand(`bash ./jux/remove-app.sh ${app.toLowerCase()}`)
      ).stdout;

      spinner.succeed(
        `The app ${capitalizeFirstLetter(app)} deleted successfully`
      );
    } catch (error) {
      spinner.fail('Failed to remove the app');
      res = '';
    }

    if (!res) {
      console.log(`The app "${capitalizeFirstLetter(app)}" was not found.`);
    }
  });
