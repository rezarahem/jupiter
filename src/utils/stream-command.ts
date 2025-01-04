import { getSshConnection } from './get-ssh-connection.js';

export const streamCommand = async (
  command: string,
  skipLog: boolean = false
) => {
  const ssh = await getSshConnection();
  try {
    const result = skipLog
      ? await ssh.execCommand(command)
      : await ssh.execCommand(command, {
          onStdout: chunk => process.stdout.write(chunk.toString()),
          onStderr: chunk => process.stderr.write(chunk.toString()),
        });

    if (result.code !== 0) {
      throw new Error(`Command failed with exit code ${result.code}`);
    }

    return result;
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    ssh.dispose();
  }
};
