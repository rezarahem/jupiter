import fs from 'fs';
import path from 'path';

export const createJupiterignoreFile = (web: 'nextjs' | 'nuxtjs'): void => {
  const filePath = path.join(process.cwd(), '.jupiterignore');

  if (fs.existsSync(filePath)) {
    console.log('.jupiterignore file already exists!');
    return;
  }

  const content = `node_modules
.next
out
build
.jupiter
.env*
.gitignore
.git`;

  fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
  console.log('.jupiterignore file created');
};
