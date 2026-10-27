import { createApp } from './bridge.js';
import * as appMod from './src/main.js';

const FRONTEND = "C:\\Users\\usuario\\Documents\\dev\\mindustry-launcher/src/frontend";
const RESOURCES = null;
const EXECUTABLES = null;

const app = await createApp({
  htmlPath: FRONTEND + '/index.html',
  title: "mindustry-launcher",
  size: "960x640",
  version: "0.1.0",
  tinyjsVersion: "v0.66.2",
  id: "com.example.mindustry-launcher",
  resourcesPath: RESOURCES,
  executablesPath: EXECUTABLES,
  api: appMod.api ?? {},
  onMenu: appMod.onMenu,
  onTray: appMod.onTray,
  onHotkey: appMod.onHotkey,
  onContextMenu: appMod.onContextMenu,
  onSystem: appMod.onSystem,
  onOpenUrl: appMod.onOpenUrl,
  onOpenFiles: appMod.onOpenFiles,
  onNotificationClick: appMod.onNotificationClick,
  onNotificationAction: appMod.onNotificationAction,
  onMediaKey: appMod.onMediaKey,
  onWindowClosed: appMod.onWindowClosed,
  onWindowState: appMod.onWindowState,
  onClipboardChange: appMod.onClipboardChange,
  onUpdateAvailable: appMod.onUpdateAvailable,
  onAudioTap: appMod.onAudioTap,
  onLocale: appMod.onLocale,
  onNavigate: appMod.onNavigate,
  onDownload: appMod.onDownload,
  onWindowOpen: appMod.onWindowOpen,
  url: null,
  downloads: null,
  popups: null,
  apiAccess: null,
  inject: null,
  chrome: null,
  update: null,
  activation: null,
  mainWindow: true,
  readAccess: null,
  userAgent: null,
  audioTap: null,
  windowPlacement: null,
  contextMenu: true,
  browserAccelerators: false,
  debug: false,
  about: null,
  urlScheme: null,
  fileExtensions: null,
  openFolders: false,
  permissions: null,
  offscreenRescue: null,
  rememberWindows: false,
});
if (appMod.init) appMod.init(app);

let reloadTimer = null;
async function watchTree(dir, cb, skip = () => false, perDir = false) {
  const watchers = new Map();
  const add = async (rel) => {
    if (watchers.has(rel)) return;
    const path = rel ? dir + '/' + rel : dir;
    try {
      watchers.set(rel, tjs.watch(path, (file) => {
        if (!file) return;
        const r = (rel ? rel + '/' : '') + String(file).replace(/\\/g, '/');
        if (skip(r)) return;
        if (perDir) sync(r);
        cb(r);
      }));
    } catch { return; }
    if (!perDir) return;
    try {
      for await (const e of await tjs.readDir(path)) {
        const r = (rel ? rel + '/' : '') + e.name;
        if (e.isDirectory && !skip(r)) await add(r);
      }
    } catch {}
  };
  // A name that changed may be a folder made (watch it and what's inside) or
  // removed (drop its watches, so one made again later is watched afresh).
  const sync = async (r) => {
    let isDir = false;
    try { isDir = (await tjs.stat(dir + '/' + r)).isDirectory; } catch {}
    if (isDir) return add(r);
    for (const [k, w] of watchers) {
      if (k === r || k.startsWith(r + '/')) { try { w.close(); } catch {} watchers.delete(k); }
    }
  };
  await add('');
}
await watchTree(FRONTEND, () => {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(async () => {
    try {
      await app.reload();
      console.log('tinyjs: frontend reloaded');
    } catch (e) {
      console.log('tinyjs: frontend reload failed:', String(e));
    }
  }, 150);
}, undefined, false);

const launcherSt = await app.done;
if (launcherSt?.term_signal || launcherSt?.exit_status) {
  console.error('tinyjs: webview launcher ' + (launcherSt.term_signal
    ? 'killed by ' + launcherSt.term_signal
    : 'exited with status ' + launcherSt.exit_status));
  tjs.exit(launcherSt.exit_status || 1);
}
tjs.exit(0);
