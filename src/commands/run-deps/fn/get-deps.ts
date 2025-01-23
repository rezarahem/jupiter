import { glob } from 'glob';

export const getDepsPath = async () => {
 try {
  const deps = await glob('deps/**/*', { absolute: true, nodir: true });

  return {
   deps,
   dockerComposePath: deps.find((p) =>
    p.includes('docker-compose.yml')
   ) as string,
  };
 } catch (error) {
  console.log(error);
  process.exit(1);
 }
};
