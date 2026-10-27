// Your app's backend. Runs on txiki.js with full system access.
//
// Every function in `api` is callable from the page:
//   const result = await api.call('name', { ...params });
// Each handler receives (params, app) — `app` has push/setTitle/setSize/quit.
//
// Built-ins you get for free: ping, log, quit, win.setTitle, win.setSize,
// dialog.openFile/openFiles/pickFolder/saveFile + alert/confirm/prompt —
// native dialogs, application-modal (which is why they aren't on tiny.win).

const dec = new TextDecoder();

export const api = {
  async openGame({ path } = {}) {
    const gameExe =
      path || "C:/Users/usuario/Downloads/mindustry/Mindustry.exe";

    // `tjs.exec()` reemplaza el proceso actual; para lanzar un ejecutable sin
    // cerrar la app launcher hay que crear un proceso hijo con `spawn()`.
    if (typeof gameExe === "string" && gameExe.trim()) {
      tjs.spawn(gameExe, { stdio: "ignore" });
    }
  },
};

// Called once the window is up. Use `app` to push events to the page.
export function init(app) {
  const startedAt = Date.now();
  setInterval(() => {
    app.push("tick", {
      time: new Date().toLocaleTimeString(),
      uptime: Math.floor((Date.now() - startedAt) / 1000),
    });
  }, 1000);
}
