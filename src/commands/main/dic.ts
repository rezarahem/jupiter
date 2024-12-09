import fs from 'fs';
import path from 'path';

export const getDirectoryInfo = (title: string) => {
  let directory;
  let appTitle;

  if (title === '.') {
    directory = process.cwd();
    appTitle = path.basename(directory);

    if (fs.existsSync(path.join(directory, '.git'))) {
      throw new Error(
        'The current directory already contains a Git repository. Aborting the process.'
      );
    }
  } else {
    directory = path.join(process.cwd(), title);
    appTitle = title;
  }

  return { directory, appTitle };
};

export const createDirectory = (directory: string) => {
  if (directory !== process.cwd() && !fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};
