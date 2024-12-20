import path from 'path';
import fs from 'fs';

export const isNextJsProject = (): boolean => {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const dependencies = packageJson.dependencies || {};

  return 'next' in dependencies;
};
