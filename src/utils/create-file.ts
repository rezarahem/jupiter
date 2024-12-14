import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

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
  // Ensure the directory exists, create it if it doesn't
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (force) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File "${filename}" has been updated successfully.`);
    return;
  }

  if (fs.existsSync(filePath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `The file "${filename}" already exists. Do you want to overwrite it?`,
        default: false,
      },
    ]);

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
