import { findApp } from "./find-app.js";

export const checkApp = async () => {
  const app = await findApp();

  if (app !== "nextjs") {
    // console.log('Jupiter currently supports only Next.js and Nuxt.js projects. Please create a project using: npx create-next-app or npx create-nuxt-app.');
    console.log(
      "Jupiter currently only supports Next.js projects. Please create a Next.js app using the command: npx create-next-app"
    );
    process.exit(1);
  }
};
