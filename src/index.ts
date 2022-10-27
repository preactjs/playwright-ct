import {
  test as baseTest,
  expect,
  devices,
  // @ts-ignore
  _addRunnerPlugin,
  PlaywrightTestConfig as BasePlaywrightTestConfig,
} from "@playwright/test";
// @ts-ignore
import { fixtures } from "@playwright/test/lib/mount";
import * as path from "path";
// @ts-ignore
import type { InlineConfig } from "vite";

export type PlaywrightTestConfig = Omit<BasePlaywrightTestConfig, "use"> & {
  use?: BasePlaywrightTestConfig["use"] & {
    ctPort?: number;
    ctTemplateDir?: string;
    ctCacheDir?: string;
    ctViteConfig?: InlineConfig;
  };
};

_addRunnerPlugin(() => {
  // Only fetch upon request to avoid resolution in workers.
  const { createPlugin } = require("@playwright/test/lib/plugins/vitePlugin");
  // return createPlugin(path.join(__dirname, "setup.mts"), () => {
  return createPlugin(path.join(__dirname, "../dist/setup.mjs"), () => {
    return require("@preact/preset-vite").default({});
  });
});

const test = baseTest.extend(fixtures);

export { test, expect, devices };
