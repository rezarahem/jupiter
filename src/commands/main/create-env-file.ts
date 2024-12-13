import { createFile } from '../../utils/create-file.js';

type CreateEnvFileProps = {
  directory: string;
  databaseUrl: string;
  dbRemoteSsh: string;
};

export const createEnvFile = async ({
  directory,
  databaseUrl,
  dbRemoteSsh,
}: CreateEnvFileProps) => {
  const content = `#! never ever commit this file 💀
# Add your environment variables here

DATABASE_URI = ${databaseUrl}
DB_REMOTE_SSH = ${dbRemoteSsh}
`;

  await createFile({ directory, filename: '.env', content });
};
