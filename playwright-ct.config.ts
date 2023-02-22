import { devices, defineConfig } from "./src/index";

export default defineConfig({
  timeout: 10000,
  use: {
    ctPort: 3100,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
