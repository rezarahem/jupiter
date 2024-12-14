import { Command } from 'commander';
import { userInput } from '../../utils/user-input.js';
import { appNameSchema } from '../../zod/index.js';
import { addEnvVar } from '../../utils/add-env-var.js';
import { streamCommand } from '../../utils/stream-command.js';

export const NewApp = new Command('new-app').alias('n').action(async () => {
  let app: string;
  let res: string;

  do {
    app = await userInput({
      prompt: "What's your project called: ",
      schema: appNameSchema,
    });

    res = await streamCommand(`bash check-app.sh ${app.toLowerCase()}`);

    if (!res) {
      console.log(
        `The app name "${app}" is already in use. Please choose a different name.`
      );
    }
  } while (!res);

  await addEnvVar({
    directory: process.cwd(),
    filename: '.env.jupiter',
    variables: {
      APP: app,
    },
  });
});
