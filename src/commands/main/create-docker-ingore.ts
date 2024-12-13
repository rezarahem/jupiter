import { createFile } from '../../utils/create-file.js';

type Props = {
  directory: string;
};

export const createDockerIgnore = async ({ directory }: Props) => {
  const content = `# Node modules and build artifacts
node_modules
.next
out


# Environment files
.env
.env.local
.env.development
.env.test
.env.production

/bash-scripts
*.sh
.gitignore
.git
*.md`;

  await createFile({
    directory,
    filename: '.dockerignore',
    content,
  });
};
