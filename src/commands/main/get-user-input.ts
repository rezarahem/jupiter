import { getDirectoryInfo } from './dic.js';
import { userInput } from '../../utils/user-input.js';
import {
  domainSchema,
  emailSchema,
  sshPortSchema,
  vpsIpSchema,
  vpsUsernameSchema,
} from '../../zod/index.js';

export const getUserInput = async () => {
  const repo = await userInput({
    prompt:
      'Enter your GitHub SSH repository clone URL (e.g., git@github.com:username/repository.git): ',
    schema: domainSchema,
  });

  const domain = await userInput({
    prompt: 'Enter the domain name:',
    schema: domainSchema,
  });

  const email = await userInput({
    prompt: 'Enter the email address:',
    schema: emailSchema,
  });

  const vpsUsername = await userInput({
    prompt: 'Enter your VPS username account:',
    schema: vpsUsernameSchema,
  });

  const vpsIp = await userInput({
    prompt: 'Enter your VPS IP number:',
    schema: vpsIpSchema,
  });

  const sshPort = await userInput({
    prompt: 'Enter your SSH port number:',
    schema: sshPortSchema,
    defaultValue: '22',
  });

  const { directory, app } = getDirectoryInfo('.');

  return {
    directory,
    sshPort,
    app,
    vpsIp,
    repo,
    email: email.toLowerCase(),
    domain: domain.toLowerCase(),
    vpsUsername: vpsUsername.toLowerCase(),
  };
};
