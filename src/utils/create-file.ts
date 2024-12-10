import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

type Props = {
  directory: string;
  filename: string;
  content: string;
};

/**
 * Creates a file with the specified content in the given directory.
 * If the file already exists, prompts the user for permission to overwrite it.
 * @param directory - The target directory where the file will be created.
 * @param filename - The name of the file to be created.
 * @param content - The content to write to the file.
 */
export const createFile = async ({ content, directory, filename }: Props) => {
  const filePath = path.join(directory, filename);

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
