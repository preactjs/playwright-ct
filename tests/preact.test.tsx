import { test, expect } from "../src/index";
import { App } from "./App";

test("should render component", async ({ mount }) => {
  const component = await mount(<App />);
  await expect(component).toContainText("foo");
});
