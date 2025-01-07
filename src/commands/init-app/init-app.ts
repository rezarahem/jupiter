import { Command } from 'commander';
import { gitIint } from './fn/git-init.js';
import { createJupiterFile } from './fn/create-jupiter-file.js';
import { newAppInputs } from './fn/get-user-input.js';
import { addEnvVar } from '../../utils/add-env-var.js';
import { getAppNameAndPorts } from './fn/get-app-name-and-ports.js';
import { createDockerignore } from './fn/create-dockerignore.js';
import { createDockerComposeBase } from './fn/create-docker-compose-base.js';
import { addNextjs } from './fn/add-next/add-nextjs.js';
import { checkWebApp } from '../../utils/check-web-app.js';
import { updateScripts } from '../update-host/fn/update-scripts.js';
import { generateAppConfig } from './fn/generate-app-config.js';

export const InitApp = new Command('initialize-app')
  .alias('init')
  .description(
    'Configures the initial setup for a new application, including its environment and any required configurations.'
  )
  .option('-sup --skip-update-host', 'Skip uploading scripts to the Host')
  .action(async ops => {
    const web = await checkWebApp();

    switch (web) {
      case 'nextjs':
        await addNextjs();
        break;
      case 'nuxtjs':
        // await addNuxtjs();
        break;
    }

    const { domain, email, repo, sshPort, vpsIp, vpsUsername } =
      await newAppInputs();

    gitIint();
    createJupiterFile();

    const currentDic = process.cwd();

    await addEnvVar({
      directory: currentDic,
      filename: '.jupiter',
      variables: {
        VPS_IP: vpsIp,
        SSH_PORT: sshPort,
        VPS_USERNAME: vpsUsername,
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
      vpsIp,
      vpsUsername,
    });

    if (app) {
      await addEnvVar({
        directory: currentDic,
        filename: '.jupiter',
        variables: {
          APP: app,
        },
      });
    }
    await createDockerignore(currentDic);
    await createDockerComposeBase(app as string);

  });
