import { execSync } from 'child_process';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

export const gitIint = () => {
  const dir = process.cwd();
  const gitDir = path.join(dir, '.git');
  const gitignorePath = path.join(dir, '.gitignore');
  const envJupiter = '.jupiter';
  const envLocalPattern = '.env.*.local';

  if (!existsSync(gitDir)) {
    console.log('Git is not initialized. Initializing now...');
    try {
      execSync('git init', { cwd: dir, stdio: 'inherit' });
      console.log('Git has been initialized successfully.');
    } catch (error) {
      console.error('Error initializing Git:', error);
    }
  } else {
    console.log('Git is already initialized.');
  }

  if (!existsSync(gitignorePath)) {
    const gitignoreContent = `# Node.js
node_modules/
npm-debug.log

# Environment Files
.env
.env.local
.env.*.local

# Logs
logs
*.log
*.log.*
  
# OS Files
.DS_Store
Thumbs.db`;

    try {
      writeFileSync(gitignorePath, gitignoreContent.trim());
      console.log('.gitignore file created.');
    } catch (error) {
      console.error('Error creating .gitignore file:', error);
    }
  } else {
    console.log('.gitignore file already exists.');
  }

  if (existsSync(gitDir) && existsSync(gitignorePath)) {
    try {
      const gitignoreContent = readFileSync(gitignorePath, 'utf-8');

      if (gitignoreContent.includes(envLocalPattern)) {
        const lines = gitignoreContent.split('\n');
        const index = lines.findIndex(line => line.includes(envLocalPattern));

        if (index !== -1 && !lines.slice(index + 1).includes(envJupiter)) {
          lines.splice(index + 1, 0, envJupiter);
          writeFileSync(gitignorePath, lines.join('\n'));
        } else {
          console.log();
        }
      } else if (!gitignoreContent.includes(envJupiter)) {
        appendFileSync(gitignorePath, `\n${envJupiter}`);
      } else {
        console.log();
      }
    } catch (error) {
      console.log(error);
    }
  }
};
