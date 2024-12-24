import { createFile } from '../../../../utils/create-file.js';
import fs from 'node:fs';

export const healthCheck = async () => {
  const content = `import { NextResponse } from 'next/server';

export const GET = async () => {
  return NextResponse.json({ health: 'Ok' });
};`;

  let directory;

  if (fs.existsSync('app') && fs.lstatSync('app').isDirectory()) {
    directory = 'app';
  } else if (fs.existsSync('src/app') && fs.lstatSync('src/app').isDirectory()) {
    directory = 'src/app';
  } else {
    throw new Error('Neither app nor src/app directories exist.');
  }

  if (!fs.existsSync(`${directory}/api`)) {
    fs.mkdirSync(`${directory}/api`);
  }

  if (!fs.existsSync(`${directory}/api/hc`)) {
    fs.mkdirSync(`${directory}/api/hc`);
  }

  await createFile({
    content,
    directory: `${directory}/api/hc`,
    filename: 'route.ts',
  });
};
