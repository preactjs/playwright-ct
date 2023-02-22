import {
  test as baseTest,
  expect,
  devices,
  defineConfig as originalDefineConfig,
  PlaywrightTestConfig as BasePlaywrightTestConfig,
  Locator,
} from "@playwright/test";
// @ts-ignore
import { fixtures } from "@playwright/test/lib/mount";
import path from "path";
import { JSX } from "preact/jsx-runtime";
// @ts-ignore
import type { InlineConfig } from "vite";
import { JsonObject } from "./jsonObject";

export type PlaywrightTestConfig<T = {}, W = {}> = Omit<BasePlaywrightTestConfig<T, W>, "use"> & {
  use?: BasePlaywrightTestConfig<T, W>["use"] & {
    ctPort?: number;
    ctTemplateDir?: string;
    ctCacheDir?: string;
    ctViteConfig?: InlineConfig | (() => Promise<InlineConfig>);
  };
};

function plugin() {
  // Only fetch upon request to avoid resolution in workers.
  const { createPlugin } = require("@playwright/test/lib/plugins/vitePlugin");
  // return createPlugin(path.join(__dirname, "setup.mts"), () => {
  return createPlugin(path.join(__dirname, "../dist/setup.mjs"), () => {
    return require("@preact/preset-vite").default({});
  });
};

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

function defineConfig<T>(config: PlaywrightTestConfig<T>): PlaywrightTestConfig<T>;
function defineConfig<T, W>(config: PlaywrightTestConfig<T, W>): PlaywrightTestConfig<T, W>;
function defineConfig(config: PlaywrightTestConfig): PlaywrightTestConfig {
  return originalDefineConfig({ ...config, _plugins: [plugin] } as any);
}

export { test, expect, devices, defineConfig };
