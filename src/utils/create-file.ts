import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';

type Props = {
  directory: string;
  filename: string;
  content: string;
  force?: boolean;
};

export const createFile = async ({
  content,
  directory,
  filename,
  force = false,
}: Props) => {
  const filePath = path.join(directory, filename);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (force) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File "${filename}" has been updated successfully.`);
    return;
  }

  if (fs.existsSync(filePath)) {
    const overwrite = await confirm({
      message: `The file "${filename}" already exists. Do you want to overwrite it?`,
      default: false,
    });

    if (!overwrite) {
      console.log(`File "${filename}" was not overwritten.`);
      // process.exit(1);
    } else {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`File "${filename}" has been created successfully.`);
    }
  } else {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File "${filename}" has been created successfully.`);
  }
};
