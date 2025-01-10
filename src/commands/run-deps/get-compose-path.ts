import { glob } from 'glob';

export const getComposePath = async () => {
  try {
    const [path] = await glob('**/docker-compose.yml', { absolute: true });
    return path;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
