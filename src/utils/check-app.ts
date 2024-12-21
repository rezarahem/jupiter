import { promises as fs } from 'fs';
import * as path from 'path';

export const checkApp = async () => {
  let app: string = '';
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    if (!packageJson || !packageJson.dependencies) return;

    if (packageJson.dependencies.next) {
      app = 'nextjs';
    } else if (packageJson.dependencies.nuxt) {
      app = 'nuxtjs';
    }
  } catch (error) {}


  if (app !== 'nextjs') {
    // console.log('Jupiter currently supports only Next.js and Nuxt.js projects. Please create a project using: npx create-next-app or npx create-nuxt-app.');
    console.log(
      'Jupiter currently only supports Next.js projects. Please create a Next.js app using the command: npx create-next-app'
    );
    process.exit(1);
  }
};
