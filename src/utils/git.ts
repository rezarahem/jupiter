import { execSync } from 'child_process';

export const checkGitInstallation = () => {
  try {
    execSync('git --version', { encoding: 'utf-8' });
  } catch (error) {
    throw new Error(
      'Git is not installed. Please install Git from the following link: https://git-scm.com/downloads'
    );
  }
};
