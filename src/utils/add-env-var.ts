import { promises as fs } from 'fs';
import { createFile } from './create-file.js';

type Props = {
  directory: string;
  filename?: string;
  variables: Record<string, string>;
};

export const addEnvVar = async ({
  directory,
  filename = '.jupiter',
  variables,
}: Props) => {
  const filePath = `${directory}/${filename}`;
  let existingContent = '';

  try {
    existingContent = await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.log('No file was found');
  }

  const envMap = new Map<string, string>();
  const comments: string[] = [];

  if (existingContent) {
    existingContent.split('\n').forEach(line => {
      if (line.startsWith('#')) {
        comments.push(line);
      } else {
        const [key, ...valueParts] = line.split('=');
        if (key && key.trim()) {
          envMap.set(key.trim(), valueParts.join('=').trim());
        }
      }
    });
  }

  Object.entries(variables).forEach(([key, value]) => {
    envMap.set(key, value);
  });

  const newContent = [
    ...comments,
    ...Array.from(envMap.entries()).map(([key, value]) => `${key}=${value}`),
  ].join('\n');

  await createFile({ directory, filename, content: newContent, force: true });
};
