import { ComponentType, h, render, VNode } from "preact";

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

type PwVNode = JsxComponent | ObjectComponent;

type HookConfig = any;
type Mounter = (config: HookConfig) => Promise<void>;

declare global {
  interface Window {
    playwrightMount(
      vnode: PwVNode,
      scratch: HTMLElement,
      config: HookConfig
    ): Promise<void>;
    playwrightUnmount(scratch: HTMLElement): Promise<void>;
    playwrightUpdate(scratch: HTMLElement, vnode: PwVNode): Promise<void>;
    __pw_hooks_before_mount: Mounter[];
    __pw_hooks_after_mount: Mounter[];
  }
}

const registry = new Map<string, ComponentType>();

export function register(components: Record<string, ComponentType>) {
  for (const k in components) {
    registry.set(k, components[k]);
  }
}

function normalizeNode(node: PwVNode | string): string | VNode {
  if (typeof node === "string") return node;
  if (node.kind !== "jsx") {
    throw new Error("Expected jsx node");
  }

  const fn = registry.get(node.type as any)!;
  return h(fn || node.type, node.props, ...node.children.map(normalizeNode));
}

window.playwrightMount = async (vnode, scratch, hooksConfig) => {
  for (const hook of window.__pw_hooks_before_mount || []) {
    await hook({ hooksConfig });
  }

  render(normalizeNode(vnode), scratch);

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
