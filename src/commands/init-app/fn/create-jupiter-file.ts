import fs from 'fs';
import path from 'path';

export const createJupiterFile = () => {
  const filePath = path.join(process.cwd(), '.jupiter');

  if (fs.existsSync(filePath)) {
    console.log('.jupiter file already exists!');
    return;
  }

  const content = `# ❗ This is only for development purposes
# 💀 Don't commit or deploy this file  ⚠`;

  fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
  console.log('.jupiter file created');
};
