import path from 'path';
import { createFile } from '../../utils/create-file.js';

type CreateEnvFileProps = {
  directory: string;
  app: string;
};
export const createEnvFile = async ({ directory, app }: CreateEnvFileProps) => {
  const envContent = `#! never ever commit this file 💀
# Add your environment variables here

NEXT_PUBLIC_APP = ${app.charAt(0).toUpperCase() + app.slice(1)}
`;

  await createFile(directory, '.env', envContent);
};
