import { Command } from 'commander';
import { gitIint } from './fn/git-init.js';
import { createJupiterFile } from './fn/create-jupiter-file.js';
import { newAppInputs } from './fn/get-user-input.js';
import { addEnvVar } from '../../utils/add-env-var.js';
import { createDockerignore } from './fn/create-dockerignore.js';
import { addNextjs } from './fn/add-next/add-nextjs.js';
import { checkWebApp } from '../../utils/check-web-app.js';
import { updateScripts } from '../update-host/fn/update-scripts.js';
import { generateAppConfig } from './fn/generate-app-config.js';
import { createGithubCiAction } from '../init-github-ci/fn/create-github-deploy-action.js';

export const InitApp = new Command('initialize-app')
  .alias('init')
  .description(
    'Configures the initial setup for a new application, including its environment and any required configurations.'
  )
  .option(
    '-ci --init-github-ci',
    'Initialize GitHub Actions CI/CD workflows for automated deployment'
  )
  .option('-sup --skip-update-host', 'Skip uploading scripts to the Host')
  .action(async ops => {
    const web = await checkWebApp();

    const { domain, email, repo, sshPort, hostIp, hostUser } =
      await newAppInputs();

    gitIint();

    createJupiterFile();

    const currentDic = process.cwd();

    await addEnvVar({
      directory: currentDic,
      filename: '.jupiter',
      variables: {
        HOST_IP: hostIp,
        SSH_PORT: sshPort,
        HOST_USER: hostUser,
      },
    });

    if (!ops.skipUpdateHost) {
      await updateScripts(true);
    }

    const app = await generateAppConfig({
      domain,
      email,
      repo,
      web,
      sshPort,
      hostUser,
      hostIp,
    });

    switch (web) {
      case 'nextjs':
        await addNextjs();
        break;
      case 'nuxtjs':
        // await addNuxtjs();
        break;
    }
    await createDockerignore(currentDic);
    await addEnvVar({
      directory: currentDic,
      filename: '.jupiter',
      variables: {
        APP: app as string,
      },
    });

    if (ops.initGithubCi) {
      await createGithubCiAction();
    }
  });
