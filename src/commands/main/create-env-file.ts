import { createFile } from '../../utils/create-file.js';

type CreateEnvFileProps = {
  directory: string;
  databaseUrl: string;
};

export const createEnvFile = async ({
  directory,
  databaseUrl,
}: CreateEnvFileProps) => {
  const content = `#! never ever commit this file 💀
# Add your environment variables here

DATABASE_URI = ${databaseUrl}`;

  await createFile({ directory, filename: '.env', content });
};
