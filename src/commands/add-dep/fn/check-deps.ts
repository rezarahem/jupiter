import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { addPostgres } from './add-postgres.js';

const allChoices = [
  // {
  //   name: 'Nextjs',
  //   value: 'nextjs',
  //   handler: addNextjs,
  // },
  {
    name: 'PostgreSQL',
    value: 'postgres',
    handler: addPostgres,
  },
];

export const checkDeps = async () => {
  const existingDeps: string[] = [];

  const dockerComposePath = path.join(process.cwd(), 'docker-compose.yml');

  // check postgres
  try {
    const fileContent = await fs.promises.readFile(dockerComposePath, 'utf8');
    const doc = yaml.parse(fileContent);
    if (doc.services && doc.services.postgres) {
      existingDeps.push('postgres');
    }
  } catch (error) {
    // File does not exist or cannot be read
  }

  // check nextjs
  // const dockerFilePath = path.join(
  //   process.cwd(),
  //   'docker',
  //   'Dockerfile.nextjs'
  // );
  // try {
  //   await fs.promises.access(dockerFilePath);
  //   existingDeps.push('nextjs');
  // } catch (error) {
  //   // File does not exist or cannot be accessed
  // }

  const allowedChoices = allChoices.filter(
    choice => !existingDeps.includes(choice.value)
  );

  const depHandlers = allowedChoices.reduce((handlers, choice) => {
    handlers[choice.value] = choice.handler;
    return handlers;
  }, {} as { [key: string]: () => Promise<void> });

  return { allowedChoices, depHandlers };
};
