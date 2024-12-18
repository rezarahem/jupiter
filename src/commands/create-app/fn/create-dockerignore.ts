import { createFile } from '../../../utils/create-file.js';

export const createDockerignore = async (directory: string) => {
  const content = `# Node modules and build artifacts
node_modules
.next
out

# Environment files
.jupiter
.env
.env.local
.env.development
.env.test
.env.production

# Others
.gitignore
.git
*.md`;

  await createFile({
    content,
    directory,
    filename: '.dockerignore',
  });
};
