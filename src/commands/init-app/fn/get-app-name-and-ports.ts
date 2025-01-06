import { addEnvVar } from '../../../utils/add-env-var.js';
import { capitalizeFirstLetter } from '../../../utils/capitalize-first-letter.js';
import { streamCommand } from '../../../utils/stream-command.js';
import { userInput } from '../../../utils/user-input.js';
import { appNameSchema } from '../../../zod/index.js';
import ora from 'ora';

const jux = '~/jupiter/jux';

export const getAppNameAndPorts = async (data: any) => {
  let shouldBreak = false;
  let app: string;
  let port1: string = '';
  let port2: string = '';

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
      const res = (
        await streamCommand(
          `bash -c "bash ${jux}/check-app.sh ${app.toLowerCase()}"`
        )
      ).stdout;

      const code = res.split('@')[0];

      switch (code) {
        case '409':
          spinner.fail(
            `The app name "${capitalizeFirstLetter(
              app
            )}" is already in use. Please choose a different name.`
          );
          break;
        case '200':
          const ports = res.split('@')[1]?.split(':');
          port1 = ports?.[0] as string;
          port2 = ports?.[1] as string;
          spinner.succeed(
            `The app ${capitalizeFirstLetter(app)} created successfully.`
          );
          shouldBreak = true;
          break;
        case '206':
          spinner.fail('No available ports found within the defined range.');
          shouldBreak = true;
          break;
      }
    } catch (error) {
      spinner.fail('Something went wrong.');
    }

    if (shouldBreak) {
      break;
    }
  } while (true);

  await addEnvVar({
    directory: process.cwd(),
    filename: '.jupiter',
    variables: {
      APP: app,
      APOLLO: port1,
      ARTEMIS: port2,
    },
  });

  return app.toLowerCase();
};
