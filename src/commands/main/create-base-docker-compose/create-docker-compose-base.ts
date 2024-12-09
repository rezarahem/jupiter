import fs from 'fs';
import path from 'path';
import { createFile } from '../../../utils/create-file.js';

export const createDockerComposeBase = async (app: string) => {
    const templatePath = path.resolve(__dirname, './docker-compose-base.template');
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    createFile('./docker-compose.base.yml', '.env', templateContent)
}