import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export const checkGitInstallation = () => {
  try {
    execSync('git --version', { encoding: 'utf-8' });
  } catch (error) {
    throw new Error(
      'Git is not installed. Please install Git from the following link: https://git-scm.com/downloads'
    );
  }
};

export const gitClone = (repositoryUrl: string, directory: string) => {
  try {
    execSync(
      `git clone --single-branch -b main ${repositoryUrl} ${directory}`,
      { stdio: 'inherit' }
    );

    const gitDir = path.join(directory, '.git');
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
    }
  } catch (error) {
    throw new Error(
      'Something went wrong while cloning the repository. Please try again later.'
    );
  }
};
