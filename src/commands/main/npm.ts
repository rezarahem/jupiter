import { execSync } from 'child_process';

export const installDependencies = (directory: string) => {
  try {
    execSync('npm install', { stdio: 'inherit', cwd: directory });
  } catch (error) {
    throw new Error(
      'Failed to install dependencies. Please run "npm install" manually in the project directory.'
    );
  }
};
