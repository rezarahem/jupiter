import { execSync } from 'child_process';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

export const gitIint = () => {
  const dir = process.cwd();
  const gitDir = path.join(dir, '.git');
  const gitignorePath = path.join(dir, '.gitignore');
  const envJupiter = '.jupiter';
  const envLocalPattern = '.env.*.local';

  // Initialize Git if not initialized
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

  // Create .gitignore if it doesn't exist
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

  // If Git and .gitignore exist, add .jupiter to the .gitignore
  if (existsSync(gitDir) && existsSync(gitignorePath)) {
    try {
      const gitignoreContent = readFileSync(gitignorePath, 'utf-8');

      // Check if .env.*.local exists and add .env.jupiter after it
      if (gitignoreContent.includes(envLocalPattern)) {
        const lines = gitignoreContent.split('\n');
        const index = lines.findIndex(line => line.includes(envLocalPattern));

        // Insert .env.jupiter after .env.*.local if it isn't already there
        if (index !== -1 && !lines.slice(index + 1).includes(envJupiter)) {
          lines.splice(index + 1, 0, envJupiter);
          writeFileSync(gitignorePath, lines.join('\n'));
          // console.log('.env.jupiter added to .gitignore after .env.*.local.');
        } else {
          console
            .log
            // '.env.jupiter is already in the correct place in .gitignore.'
            ();
        }
      } else if (!gitignoreContent.includes(envJupiter)) {
        // If .env.*.local doesn't exist, append .env.jupiter at the end
        appendFileSync(gitignorePath, `\n${envJupiter}`);
        // console.log('.env.jupiter added to .gitignore at the end.');
      } else {
        // console.log('.env.jupiter is already in .gitignore.');
      }
    } catch (error) {
      // console.error('Error updating .gitignore:', error);
    }
  }
};
