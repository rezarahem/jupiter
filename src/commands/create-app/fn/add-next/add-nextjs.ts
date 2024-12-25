import { docker } from './docker.js';
import { healthCheck } from './health-check.js';

export const addNextjs = async () => {
  await docker();
  await healthCheck();
};
