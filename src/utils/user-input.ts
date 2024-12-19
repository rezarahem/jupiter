import { input } from '@inquirer/prompts';
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
  let finalInput;

  while (true) {
    const currentInput = await input({
      message: prompt,
      default: defaultValue,
    });

    try {
      schema.parse(currentInput);
      finalInput = currentInput;
      break;
    } catch (e: any) {
      console.error(e.errors[0].message);
    }
  }

  return finalInput;
};
