"use strict";
const { app: e, BrowserWindow: o } = require("electron"),
  i = require("path");
function n() {
  const t = new o({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: !0, contextIsolation: !1 },
  });
  process.env.NODE_ENV === "development"
    ? t.loadURL("http://localhost:3000")
    : t.loadFile(i.join(__dirname, "../dist/index.html"));
}
e.whenReady().then(() => {
  n(),
    e.on("activate", () => {
      o.getAllWindows().length === 0 && n();
    });
});
e.on("window-all-closed", () => {
  process.platform !== "darwin" && e.quit();
});
