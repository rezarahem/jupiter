import fs from 'fs';
import path from 'path';

export const getDirectoryInfo = (title: string) => {
  let directory;
  let app;

  if (title === '.') {
    directory = process.cwd();
    app = path.basename(directory);
  } else {
    directory = path.join(process.cwd(), title);
    app = title;
  }

  return { directory, app };
};

export const createDirectory = (directory: string) => {
  if (directory !== process.cwd() && !fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};
