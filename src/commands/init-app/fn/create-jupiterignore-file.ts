import fs from 'fs';
import path from 'path';

export const createJupiterignoreFile = (): void => {
  const filePath = path.join(process.cwd(), '.jupiterignore');

  if (fs.existsSync(filePath)) {
    console.log('.jupiterignore file already exists!');
    return;
  }

  const content = `.jupiter
  node_modules
`;

  fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
  console.log('.jupiterignore file created');
};
