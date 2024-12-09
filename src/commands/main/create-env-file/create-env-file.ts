import fs from 'fs';
import path from 'path';
import { createFile } from '../../../utils/create-file.js';

export const createEnvFile = async (dic: string, app: string) => {
    const templatePath = path.resolve(__dirname, './env.template');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const envContent = templateContent.replace('$APP', app);

    createFile(dic, '.env', envContent)
}