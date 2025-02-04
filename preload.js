const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"),
});

contextBridge.exposeInMainWorld("api", {
  request: async ({ url, method }) => {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-type": "application/json",
      },
    });
    const json = await res.json();
    return json;
  },
});
