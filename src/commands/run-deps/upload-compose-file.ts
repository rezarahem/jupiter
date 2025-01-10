import { NodeSSH } from 'node-ssh';

export const uploadComposeFile = async (
  ssh: NodeSSH,
  app: string,
  path: string
) => {
  try {
    const dep = `jupiter/apps/${app}_deps`;
    const depCmd = `test -d ${dep} && echo "exists" || echo "not exists"`;
    const depCheck = await ssh.execCommand(depCmd);

    if (depCheck.stdout.trim() === 'not exists') {
      const res = await ssh.execCommand(`mkdir -p ${dep}`);
      if (res.code === 1) {
        process.exit(1);
      }
    }

    await ssh.putFile(path, `${dep}/docker-compose.yml`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
