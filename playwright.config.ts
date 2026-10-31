import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3000",
    headless: true,
    ...(process.env.TINYSTEPS_CHROMIUM_EXECUTABLE
      ? {
          launchOptions: {
            executablePath: process.env.TINYSTEPS_CHROMIUM_EXECUTABLE,
          },
        }
      : { channel: "chrome" }),
  },
  reporter: "list",
});
