import { glob } from 'glob';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const getScriptsPath = async () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  const relativePath = '../../../../../sh';
  const scriptsPath = `${resolve(dir, relativePath)}/**/*.sh`;
  const files = await glob(scriptsPath);
  return files;
};
