const __pw_hooks_before_mount: any[] = [];
const __pw_hooks_after_mount: any[] = [];

window.__pw_hooks_before_mount = __pw_hooks_before_mount;
window.__pw_hooks_after_mount = __pw_hooks_after_mount;

export const beforeMount = (callback: any) => {
  __pw_hooks_before_mount.push(callback);
};

export const afterMount = (callback: any) => {
  __pw_hooks_after_mount.push(callback);
};
