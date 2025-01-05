import {
  domainSchema,
  emailSchema,
  sshPortSchema,
  vpsIpSchema,
  vpsUsernameSchema,
} from '../../../zod/index.js';
import { userInput } from '../../../utils/user-input.js';

export const newAppInputs = async () => {
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
    VPS_IP: vpsIp,
    SSH_PORT: sshPort,
    EMAIL: email.toLowerCase(),
    DOMAIN: domain.toLowerCase(),
    VPS_USERNAME: vpsUsername.toLowerCase(),
  };
};
