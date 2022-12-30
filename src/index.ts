import {
  test as baseTest,
  expect,
  devices,
  // @ts-ignore
  _addRunnerPlugin,
  PlaywrightTestConfig as BasePlaywrightTestConfig,
  Locator,
} from "@playwright/test";
// @ts-ignore
import { fixtures } from "@playwright/test/lib/mount";
import path from "path";
import { JSX } from 'preact/jsx-runtime';
// @ts-ignore
import type { InlineConfig } from "vite";
import { JsonObject } from './jsonObject';

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

export interface MountOptions<HooksConfig extends JsonObject> {
  hooksConfig?: HooksConfig;
}

interface MountResult extends Locator {
  unmount(): Promise<void>;
  update(component: JSX.Element): Promise<void>;
}

interface ComponentFixtures {
  mount<HooksConfig extends JsonObject>(
    component: JSX.Element,
    options?: MountOptions<HooksConfig>
  ): Promise<MountResult>;
}

const test = baseTest.extend<ComponentFixtures>(fixtures);

export { test, expect, devices };
