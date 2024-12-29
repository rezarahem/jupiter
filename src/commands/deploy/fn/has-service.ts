import fs from 'fs';
import yaml from 'yaml';

export const hasServices = (): boolean => {
  try {
    const filePath = './docker-compose.yml';
    if (!fs.existsSync(filePath)) {
      console.log(
        `No docker-compose was found, run Ju create to generate one.`
      );
      process.exit(1);
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = yaml.parse(fileContent);
    return !!parsed?.services && Object.keys(parsed.services).length > 0;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
