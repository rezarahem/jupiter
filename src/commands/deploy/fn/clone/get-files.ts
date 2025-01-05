import { glob } from "glob";
import path, { join } from "path";

export const getFiles = async (remoteDir: string) => {
  const ignore = [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    ".jupiter/**",
    ".env*",
    ".gitignore",
    ".git/**",
    "**/*.md",
  ];

  const files = await glob("**/*", {
    nodir: true,
    ignore,
  });

  return files.map((file) => ({
    local: path.resolve(file),
    remote: join(remoteDir, file),
  }));
};
