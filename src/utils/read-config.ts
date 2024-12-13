import { readFileSync } from 'fs';

export const readConfig = () => {
  try {
    const config = JSON.parse(readFileSync('jupiter.config.json', 'utf8'));
    return config;
  } catch (error) {
    console.error('Error reading or parsing config file:', error);
    process.exit(1);
  }
};
