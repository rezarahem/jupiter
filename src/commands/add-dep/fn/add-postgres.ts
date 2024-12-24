import { updateDockerCompose } from '../../../utils/update-docker-compose.js';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { addEnvVar } from '../../../utils/add-env-var.js';

export const addPostgres = async () => {
  //0
  dotenv.config({ path: '.jupiter' });
  const app = process.env.APP;
  if (!app) {
    console.log(
      'No application found. Please initialize an application with the command: ju create'
    );
    process.exit(1);
  }

  //0
  const user = faker.person.firstName().toLowerCase();
  const password = faker.internet.password();
  const db = faker.person.lastName().toLowerCase();

  const configContent = `
  services:
    postgres:
      image: postgres:17.2-alpine
      container_name: postdb
      environment:
        POSTGRES_USER: ${user}
        POSTGRES_PASSWORD: ${password}
        POSTGRES_DB: ${db}
      ports:
        - '5432:5432'
      volumes:
        - db_volume:/var/lib/postgresql/data
      networks:
        - ${app}  
      restart: always    

  volumes:
    db_volume:
    `;

  await updateDockerCompose(app, configContent);
  
  const dataBaseUrl = `postgresql://${user}:${password}@localhost:5432/${db}`;

  await addEnvVar({
    directory: process.cwd(),
    variables: {
      DATABASE_URL: dataBaseUrl,
      POSTGRES_USER: user,
      POSTGRES_PASSWORD: password,
      POSTGRES_DB: db,
    },
  });

  await addEnvVar({
    directory: process.cwd(),
    filename: '.env',
    variables: {
      DATABASE_URL: dataBaseUrl,
    },
  });
};
