import fs from 'fs';
import path from 'path';

export const createEnvFile = (directory: string, appTitle: string) => {
  const envPath = path.join(directory, '.env');
  if (!fs.existsSync(envPath)) {
    const envContent = `#! never ever commit this file 💀
  # Add your environment variables here

  NEXT_PUBLIC_APP = ${appTitle}`;

    fs.writeFileSync(envPath, envContent, 'utf8');
  }
};
