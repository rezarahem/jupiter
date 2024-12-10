import { createFile } from '../../utils/create-file.js';
import { faker } from '@faker-js/faker';

type Props = {
  directory: string;
  app: string;
};

export const createDockerComposeBase = async ({ directory, app }: Props) => {
  const user = faker.person.firstName().toLowerCase();
  const password = faker.internet.password();
  const db = faker.person.lastName().toLowerCase();

  const content = `services:
 postgres:
   image: 17.2-alpine
   container_name: postdb
   environment:
      POSTGRES_USER: ${user}
      POSTGRES_PASSWORD: ${password}
      POSTGRES_DB: ${db}
   ports:
     - '127.0.0.1:5432:5432'
   volumes:
     - postdb_volume:/var/lib/postgresql/data
   networks:
     - ${app}

networks:
  ${app}:
    driver: bridge

volumes:
  postdb_volume:`;

  await createFile({ directory, filename: 'docker-compose.base.yml', content });

  return {
    privateConnectionUrl: `postgresql://${user}:${password}@127.0.0.1:5432/${db}`,
  };
};
