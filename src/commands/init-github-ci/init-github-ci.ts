import { Command } from 'commander';
import { createGithubCiAction } from './fn/create-github-deploy-action.js';

export const InitGithubCi = new Command('init-github-ci')
  .alias('ci')
  .description(
    'Sets up CI/CD with GitHub Actions workflows for automated deployment.'
  )
  .action(async () => {
    await createGithubCiAction();
  });
