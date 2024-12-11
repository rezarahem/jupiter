import { z } from 'zod';

export const domainSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
    'Invalid domain name (must follow the format "example.com")'
  );

export const emailSchema = z
  .string()
  .email('Invalid email address (must follow the format "example@mail.com")');

export const sshPortSchema = z
  .string()
  .min(1, { message: 'Port cannot be empty.' })
  .max(5, { message: 'Port cannot be longer than 5 characters.' })
  .regex(/^\d+$/, { message: 'Port must be a valid number.' })
  .refine(
    val => {
      const port = parseInt(val, 10);
      return port >= 1 && port <= 65535;
    },
    {
      message: 'Port should be between 1 and 65535.',
    }
  );

export const vpsIpSchema = z
  .string()
  .min(1, { message: 'IP address cannot be empty.' })
  .regex(
    /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    { message: 'Invalid IPv4 address.' }
  );

export const vpsUsernameSchema = z
  .string()
  .min(1, { message: 'Username cannot be empty.' })
  .max(32, { message: 'Username cannot be longer than 32 characters.' })
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Username can only contain letters, numbers, hyphens, and underscores.',
  });
