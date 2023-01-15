import { test, expect } from "../src/index";
import { Button } from './components/Button';
import { DefaultChildren } from './components/DefaultChildren';
import { MultiRoot } from './components/MultiRoot';
import { Counter } from './components/Counter';
import { EmptyFragment } from './components/EmptyFragment';
import { Theme } from './components/theme';
import type { HooksConfig } from '../playwright';

test('render props', async ({ mount }) => {
  const component = await mount(<Button title="Submit" />);
  await expect(component).toContainText('Submit');
});

test('render attributes', async ({ mount }) => {
  const component = await mount(<Button className="primary" title="Submit" />);
  await expect(component).toHaveClass('primary');
});

test('update props without remounting', async ({ mount }) => {
  const component = await mount(<Counter count={9001} />);
  await expect(component.locator('#props')).toContainText('9001');

  await component.update(<Counter count={1337} />);
  await expect(component).not.toContainText('9001');
  await expect(component.locator('#props')).toContainText('1337');

  await expect(component.locator('#remount-count')).toContainText('1');
})

test('update callbacks without remounting', async ({ mount }) => {
  const component = await mount(<Counter />);

  const messages: string[] = [];
  await component.update(<Counter onClick={message => {
    messages.push(message)
  }} />);
  await component.click();
  expect(messages).toEqual(['hello']);

  await expect(component.locator('#remount-count')).toContainText('1');
})

test('update slots without remounting', async ({ mount }) => {
  const component = await mount(<Counter>Default Slot</Counter>);
  await expect(component).toContainText('Default Slot');

  await component.update(<Counter>Test Slot</Counter>);
  await expect(component).not.toContainText('Default Slot');
  await expect(component).toContainText('Test Slot');

  await expect(component.locator('#remount-count')).toContainText('1');
});

test('execute callback when the button is clicked', async ({ mount }) => {
  const messages: string[] = [];
  const component = await mount(<Button title="Submit" onClick={data => {
    messages.push(data)
  }}></Button>);
  await component.click();
  expect(messages).toEqual(['hello']);
});

test('render a default child', async ({ mount }) => {
  const component = await mount(<DefaultChildren>
    Main Content
  </DefaultChildren>);
  await expect(component).toContainText('Main Content');
});

test('render a component as slot', async ({ mount }) => {
  const component = await mount(<DefaultChildren>
    <Button title="Submit" />
  </DefaultChildren>);
  await expect(component).toContainText('Submit');
});

test('render multiple children', async ({ mount }) => {
  const component = await mount(<DefaultChildren>
    <div id="one">One</div>
    <div id="two">Two</div>
  </DefaultChildren>);
  await expect(component.locator('#one')).toContainText('One');
  await expect(component.locator('#two')).toContainText('Two');
});

test('render string as child', async ({ mount }) => {
  const component = await mount(<DefaultChildren>{'string'}</DefaultChildren>);
  await expect(component).toContainText('string');
});

test('render array as child', async ({ mount }) => {
  const component = await mount(<DefaultChildren>{[4,2]}</DefaultChildren>);
  await expect(component).toContainText('42');
});

test('render number as child', async ({ mount }) => {
  const component = await mount(<DefaultChildren>{1337}</DefaultChildren>);
  await expect(component).toContainText('1337');
});

test('execute callback when a child node is clicked', async ({ mount }) => {
  let clickFired = false;
  const component = await mount(<DefaultChildren>
    <span onClick={() => clickFired = true}>Main Content</span>
  </DefaultChildren>);
  await component.locator('text=Main Content').click();
  expect(clickFired).toBeTruthy();
});

test('unmount', async ({ page, mount }) => {
  const component = await mount(<Button title="Submit" />);
  await expect(page.locator('#root')).toContainText('Submit');
  await component.unmount();
  await expect(page.locator('#root')).not.toContainText('Submit');
});

test('unmount a multi root component', async ({ mount, page }) => {
  const component = await mount(<MultiRoot />);
  await expect(page.locator('#root')).toContainText('root 1');
  await expect(page.locator('#root')).toContainText('root 2');
  await component.unmount();
  await expect(page.locator('#root')).not.toContainText('root 1');
  await expect(page.locator('#root')).not.toContainText('root 2');
});

test('get textContent of the empty fragment', async ({ mount }) => {
  const component = await mount(<EmptyFragment />);
  expect(await component.allTextContents()).toEqual(['']);
  expect(await component.textContent()).toBe('');
  await expect(component).toHaveText('');
});

test('hooks configuration', async ({ mount }) => {
  const component = await mount<HooksConfig>(<Theme />, {
    hooksConfig: {
      theme: 'dark'
    }
  });
  await expect(component).toHaveText('dark');
});
