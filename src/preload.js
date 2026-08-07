const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getState: () => ipcRenderer.invoke('state:get'),
  saveProjects: (projects) => ipcRenderer.invoke('projects:save', projects),
  openUrls: (urls) => ipcRenderer.invoke('urls:open', urls),
  setPin: (value) => ipcRenderer.invoke('pin:set', value),
  setAutostart: (value) => ipcRenderer.invoke('autostart:set', value),
  setLanguage: (value) => ipcRenderer.invoke('lang:set', value),
  openExternal: (url) => ipcRenderer.invoke('link:external', url),
  quit: () => ipcRenderer.invoke('app:quit')
});
