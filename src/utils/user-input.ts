import inquirer from 'inquirer';
import { z } from 'zod';

type Props<T> = {
  schema: z.ZodType<T>;
  defaultValue?: string;
  prompt: string;
};

export const userInput = async <T>({
  defaultValue,
  prompt,
  schema,
}: Props<T>): Promise<string> => {
  let input: string;

  while (true) {
    const { i } = await inquirer.prompt([
      {
        type: 'input',
        name: 'i',
        message: prompt,
        default: defaultValue,
      },
    ]);

    try {
      schema.parse(i);
      input = i;
      break;
    } catch (e: any) {
      console.error(e.errors[0].message);
    }
  }

  return input;
};
