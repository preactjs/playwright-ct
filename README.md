# Preact playwright component testing

> **Note**
> Playwright component testing is marked as experimental by the playwright team. 

## Usage

First, install playwright and initialize component testing. Once that is done, install the preact adapter.

```sh
npm init playwright@latest -- --ct
npm install -D @preact/playwright-ct
```

After installing we need to alter our config

```ts
import { PlaywrightTestConfig } from "@preact/playwright-ct";

const config: PlaywrightTestConfig = {
  // Your config
};

export default config;
```

Now you can start adding your first test:

```jsx
// App.jsx
export function App() {
  return <h1>Hello World!</h1>
}
```

```jsx
// App.test.jsx
import { test, expect } from "@preact/playwright-ct";
import { App } from "./App";

test("should work", async ({ mount }) => {
  const component = await mount(<App />);
  await expect(component).toContainText("hello world");
});
```

Follow the offical [playwright component testing documentation](https://playwright.dev/docs/test-components) for more information on how to use it.

## License

MIT, see the [LICENSE](./LICENSE) file.
