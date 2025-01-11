import { existsSync, promises as fs } from 'fs';
import * as path from 'path';

export const checkWebApp = async () => {
  let web: string = '';
  try {
    const root = process.cwd();
    const packageJsonPath = path.join(root, 'package.json');
    if (!existsSync(packageJsonPath)) {
      console.log('Missing Package.json file in the root directory.');
      process.exit(1);
    }

    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    if (packageJson?.dependencies?.next) {
      web = 'nextjs';
    } else if (packageJson?.dependencies?.nuxt) {
      web = 'nuxtjs';
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  if (web !== 'nextjs') {
    // console.log('Jupiter currently supports only Next.js and Nuxt.js projects. Please create a project using: npx create-next-app or npx create-nuxt-app.');
    console.log(
      'Jupiter currently only supports Next.js projects. Please create a Next.js app using the command: npx create-next-app'
    );
    process.exit(0);
  }

  return web as 'nextjs' | 'nuxtjs';
};
