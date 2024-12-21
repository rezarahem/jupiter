import { Command } from "commander";
import { checkApp } from "../../utils/check-app.js";

export const Deploy = new Command('deploy')
  .alias('d')
  .description('Deploy the application to the specified environment')
  .action(async () => {
    await checkApp()
    // ...existing code...
});