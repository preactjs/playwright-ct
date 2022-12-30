import { JSX } from 'preact/jsx-runtime';

const __pw_hooks_before_mount: any[] = [];
const __pw_hooks_after_mount: any[] = [];

window.__pw_hooks_before_mount = __pw_hooks_before_mount;
window.__pw_hooks_after_mount = __pw_hooks_after_mount;

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
type JsonArray = JsonValue[];
type JsonObject = { [Key in string]?: JsonValue };

export const beforeMount = <HooksConfig extends JsonObject>(
  callback: (params: { hooksConfig: HooksConfig; App: () => JSX.Element }) => Promise<void | JSX.Element>
) => {
  __pw_hooks_before_mount.push(callback);
};

export const afterMount = <HooksConfig extends JsonObject>(
  callback: (params: { hooksConfig: HooksConfig }) => Promise<void>
) => {
  __pw_hooks_after_mount.push(callback);
};
