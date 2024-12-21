import { promises as fs } from 'fs';
import * as path from 'path';

export const findApp = async (): Promise<string | undefined> => {
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    if (!packageJson || !packageJson.dependencies) return;

    if (packageJson.dependencies.next) {
      return 'nextjs';
    } else if (packageJson.dependencies.nuxt) {
      return 'nuxtjs';
    }
  } catch (error) {
  
  }
};
