import {
  domainSchema,
  emailSchema,
  githubSshCloneString,
  sshPortSchema,
  vpsIpSchema,
  vpsUsernameSchema,
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

  const vpsUsername = await userInput({
    prompt: 'Enter your VPS username account: ',
    schema: vpsUsernameSchema,
    defaultValue: 'root',
  });

  const vpsIp = await userInput({
    prompt: 'Enter your VPS IP number: ',
    schema: vpsIpSchema,
  });

  const sshPort = await userInput({
    prompt: 'Enter your SSH port number: ',
    schema: sshPortSchema,
    defaultValue: '22',
  });

  return {
    repo,
    vpsIp,
    sshPort,
    email: email.toLowerCase(),
    domain: domain.toLowerCase(),
    vpsUsername: vpsUsername.toLowerCase(),
  };
};
