import { addEnvVar } from '../../../utils/add-env-var.js';
import { capitalizeFirstLetter } from '../../../utils/capitalize-first-letter.js';
import { streamCommand } from '../../../utils/stream-command.js';
import { userInput } from '../../../utils/user-input.js';
import { appNameSchema } from '../../../zod/index.js';
import ora from 'ora';

export const getAppName = async () => {
  let app: string;
  let res: string;

  do {
    app = await userInput({
      prompt: "What's your project called: ",
      schema: appNameSchema,
    });

    const spinner = ora(
      `Checking if the app name "${capitalizeFirstLetter(
        app
      )}" is available...\n`
    ).start();

    try {
      res = await streamCommand(
        `bash ./jupiter/check-app.sh ${app.toLowerCase()}`
      );

      spinner.succeed(
        `The app ${capitalizeFirstLetter(app)} created successfully`
      );
    } catch (error) {
      spinner.fail('Failed to check app name');
      res = '';
    }

    if (!res) {
      console.log(
        `The app name "${capitalizeFirstLetter(
          app
        )}" is already in use. Please choose a different name.`
      );
    }
  } while (!res);

  await addEnvVar({
    directory: process.cwd(),
    filename: '.jupiter',
    variables: {
      APP: app,
    },
  });
};
