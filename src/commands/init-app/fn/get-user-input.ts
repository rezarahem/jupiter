import {
  domainSchema,
  emailSchema,
  githubSshCloneString,
  sshPortSchema,
  hostIpSchema,
  hostUsernameSchema,
} from '../../../zod/index.js';
import { userInput } from '../../../utils/user-input.js';

export const newAppInputs = async () => {
  const repo = await userInput({
    prompt:
      'Enter your GitHub SSH repository clone URL (e.g., git@github.com:username/repository.git): ',
    schema: githubSshCloneString,
  });

  const domain = await userInput({
    prompt: 'Enter the domain name: ',
    schema: domainSchema,
  });

  const email = await userInput({
    prompt: 'Enter the email address: ',
    schema: emailSchema,
  });

  const hostUser = await userInput({
    prompt: 'Enter your HOST username account: ',
    schema: hostUsernameSchema,
    defaultValue: 'root',
  });

  const hostIp = await userInput({
    prompt: 'Enter your HOST IP number: ',
    schema: hostIpSchema,
  });

  const sshPort = await userInput({
    prompt: 'Enter your SSH port number: ',
    schema: sshPortSchema,
    defaultValue: '22',
  });

  return {
    repo,
    hostIp,
    sshPort,
    email: email.toLowerCase(),
    domain: domain.toLowerCase(),
    hostUser: hostUser.toLowerCase(),
  };
};
