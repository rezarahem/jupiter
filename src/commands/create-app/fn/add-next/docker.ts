import dotenv from 'dotenv';
import { createFile } from '../../../../utils/create-file.js';

export const docker = async () => {
  dotenv.config({ path: '.jupiter' });

  const content = `#1
    FROM node:22-alpine AS base 
    WORKDIR /prod
    RUN apk add --no-cache curl
    
    #2
    FROM base AS build 
    ENV NODE_ENV=build
    COPY package.json package-lock.json ./
    RUN npm ci --verbose 
    COPY . .
    RUN npm run build
    
    # Remove dev dependencies
    RUN npm prune --production --verbose
    
    #3
    FROM base AS prod
    ENV NODE_ENV=production
    COPY --from=build /prod/public ./public
    COPY --from=build /prod/.next/standalone ./
    COPY --from=build /prod/.next/static ./.next/static
    
    EXPOSE 3000
    
    CMD ["node", "server.js"]`;

  await createFile({
    content,
    directory: 'docker',
    filename: 'Dockerfile.nextjs',
  });
};