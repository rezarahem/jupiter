import { getSshConnection } from "./get-ssh-connection.js";

export const streamMultiCommands = async (
  commands: string[]
): Promise<void> => {
  const ssh = await getSshConnection();
  try {
    for (const command of commands) {
      const result = await ssh.execCommand(command, {
        onStdout: (chunk) => process.stdout.write(chunk.toString()),
        onStderr: (chunk) => process.stderr.write(chunk.toString()),
      });

      if (result.code !== 0) {
        throw new Error(`Command failed with exit code ${result.code}`);
      }
    }
  } catch (error) {
    throw error;
  } finally {
    ssh.dispose();
  }
};
