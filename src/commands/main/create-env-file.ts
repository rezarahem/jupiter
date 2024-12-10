import { createFile } from '../../utils/create-file.js';

type CreateEnvFileProps = {
  directory: string;
  privateConnectionUrl: string;
};

export const createEnvFile = async ({
  directory,
  privateConnectionUrl,
}: CreateEnvFileProps) => {
  const content = `#! never ever commit this file 💀
# Add your environment variables here

DATABASE_URI = ${privateConnectionUrl}
`;

  await createFile({ directory, filename: '.env', content });
};
