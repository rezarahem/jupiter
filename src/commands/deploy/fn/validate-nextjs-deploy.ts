import { existsSync, readFileSync } from 'fs';
import { glob } from 'glob';
import path from 'path';
type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export const validateNextjsDeploy = async () => {
  const root = process.cwd();
  const packageLockPath = path.join(root, 'package-lock.json');

  if (!existsSync(packageLockPath)) {
    console.log('Missing Package.json file in the root directory.');
    process.exit(1);
  }

  const [config] = await glob(`${root}/next.config.{ts,mjs}`);

  if (!config) {
    console.log('Missing Next.config file in the root directory.');
    process.exit(1);
  }

  const configStr = readFileSync(config, 'utf-8');
  const outputRegex = /^(?!.*\/\/).*output:\s*'standalone'/m;
  const hasOutputFlag = outputRegex.test(configStr);
  const compressRegex = /^(?!.*\/\/).*compress:\s*false/m;
  const hasCompressFlag = compressRegex.test(configStr);

  if (!hasOutputFlag || !hasCompressFlag) {
    if (!hasOutputFlag) {
      console.error(
        'The output flag must be set to "Standalone" in the Next.config.'
      );
      console.error(
        'Jupiter cannot deploy Next.js apps that are not set to "Standalone".'
      );
    }
    if (!hasCompressFlag) {
      console.error(
        'The compress flag must be set to "true" in the Next.config.'
      );
      console.error(
        'Jupiter requires the compress flag to be "true" for deployment.'
      );
    }
    return false;
  }

  return true;
};
