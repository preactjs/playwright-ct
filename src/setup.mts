import { ComponentType, h, JSX, render, VNode, ComponentChild } from "preact";

type JsxComponent = {
  kind: "jsx";
  type: string;
  props: Record<string, any>;
  children: (PwVNode | string)[];
};

type MountOptions = {
  props?: Record<string, any>;
  slots?: Record<string, any>;
  on?: { [key: string]: Function };
  hooksConfig?: any;
};

type ObjectComponent = {
  kind: "object";
  type: string;
  options?: MountOptions;
};
type PwChild = Function | string | number | PwChild[];

type PwVNode = JsxComponent | ObjectComponent | PwChild;

declare global {
  interface Window {
    playwrightMount<HooksConfig = any>(
      vnode: PwVNode,
      scratch: HTMLElement,
      config: HooksConfig
    ): Promise<void>;
    playwrightUnmount(scratch: HTMLElement): Promise<void>;
    playwrightUpdate(scratch: HTMLElement, vnode: PwVNode): Promise<void>;
    __pw_hooks_before_mount: (<HooksConfig = any>(params: { hooksConfig: HooksConfig; App: () => any }) => Promise<void | JSX.Element>)[];
    __pw_hooks_after_mount: (<HooksConfig = any>(params: { hooksConfig: HooksConfig; }) => Promise<void>)[];
  }
}

const registry = new Map<string, ComponentType>();

export function register(components: Record<string, ComponentType>) {
  for (const k in components) {
    registry.set(k, components[k]);
  }
}

function normalizeNode(node: PwVNode): ComponentChild | VNode {
  if (typeof node !== 'object' || Array.isArray(node)) return node;
  if (node.kind !== "jsx") {
    throw new Error("Expected jsx node");
  }

  const fn = registry.get(node.type)!;
  return h(fn || node.type, node.props, ...node.children.map(normalizeNode));
}

window.playwrightMount = async (vnode, scratch, hooksConfig) => {
  let App = () => normalizeNode(vnode);
  for (const hook of window.__pw_hooks_before_mount || []) {
    const wrapper = await hook({ App, hooksConfig });
    if (wrapper) {
      App = () => wrapper;
    }
  }

  render(App(), scratch);

  for (const hook of window.__pw_hooks_after_mount || []) {
    await hook({ hooksConfig });
  }
};

window.playwrightUnmount = async (scratch: HTMLElement) => {
  render(null, scratch);
  delete (scratch as any)._k;
};

window.playwrightUpdate = async (scratch, vnode) => {
  render(normalizeNode(vnode), scratch);
};
