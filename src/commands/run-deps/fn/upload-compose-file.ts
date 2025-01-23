import { NodeSSH } from 'node-ssh';
import path from 'path';

type File = {
 local: string;
 remote: string;
};

const mapFile = (dir: string, file: string) => {
 return `${dir}/${path.basename(file)}`;
};

export const uploadComposeFile = async (
 ssh: NodeSSH,
 app: string,
 deps: string[]
) => {
 try {
  const depsDir = `jupiter/apps/${app}_deps`;
  const depCmd = `test -d ${depsDir} && echo "exists" || echo "not exists"`;
  const depsDirCheck = await ssh.execCommand(depCmd);

  if (depsDirCheck.stdout.trim() === 'not exists') {
   const res = await ssh.execCommand(`mkdir -p ${depsDir}`);
   if (res.code === 1) {
    process.exit(1);
   }
  }

  const files = deps.map((d) => ({
   local: d,
   remote: mapFile(depsDir, d),
  })) satisfies File[];

  await ssh.putFiles(files);
 } catch (error) {
  console.log(error);
  process.exit(1);
 }
};
