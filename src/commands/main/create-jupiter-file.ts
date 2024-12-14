import fs from 'fs';
import path from 'path';

export const createJupiterFile = (): void => {
  const filePath = path.join(process.cwd(), '.jupiter');

  if (fs.existsSync(filePath)) {
    console.log('.jupiter file already exists!');
    return;
  }

  const content = `# This file just stores development variables and should not be pushed to GitHub or production. 🚀🔒`;

  fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
  console.log('.jupiter file created with the development comment!');
};
