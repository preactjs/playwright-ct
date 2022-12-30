import { beforeMount, afterMount } from '../src/hooks.mjs';
import { ThemeContext } from '../tests/components/theme';

export type HooksConfig = {
  theme: 'dark' | 'light';
}

beforeMount<HooksConfig>(async ({ hooksConfig, App }) => {
  if (hooksConfig?.theme === 'dark')
     return <ThemeContext.Provider value="dark"><App /></ThemeContext.Provider>;
});

afterMount<HooksConfig>(async () => {
  console.log(`After mount`);
});
