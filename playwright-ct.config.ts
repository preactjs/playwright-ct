import { devices, PlaywrightTestConfig } from "./src/index";

const config: PlaywrightTestConfig = {
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
};

export default config;
