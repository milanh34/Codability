const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Add any API methods here when needed
});
