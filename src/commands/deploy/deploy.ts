import { Command } from "commander";
import { checkApp } from "../../utils/check-app.js";
import dotenv from 'dotenv';

export const Deploy = new Command('deploy')
  .alias('d')
  .description('Deploy the application to the specified environment')
  .action(async () => {
    await checkApp()
    dotenv.config({ path: '.jupiter' });
    const app = process.env.APP;

    // ...existing code...
});