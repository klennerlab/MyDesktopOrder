const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getState: () => ipcRenderer.invoke('state:get'),
  saveProjects: (projects) => ipcRenderer.invoke('projects:save', projects),
  openUrls: (urls, opts) => ipcRenderer.invoke('urls:open', urls, opts),
  setPin: (value) => ipcRenderer.invoke('pin:set', value),
  setLock: (value) => ipcRenderer.invoke('lock:set', value),
  setAutostart: (value) => ipcRenderer.invoke('autostart:set', value),
  setLanguage: (value) => ipcRenderer.invoke('lang:set', value),
  setScheme: (value) => ipcRenderer.invoke('scheme:set', value),
  pickLogo: () => ipcRenderer.invoke('logo:pick'),
  getFavicon: (hostname) => ipcRenderer.invoke('favicon:get', hostname),
  readBookmarks: () => ipcRenderer.invoke('bookmarks:read'),
  exportFile: () => ipcRenderer.invoke('file:export'),
  exportHtml: () => ipcRenderer.invoke('file:exportHtml'),
  importFile: () => ipcRenderer.invoke('file:import'),
  openExternal: (url) => ipcRenderer.invoke('link:external', url),
  hideWindow: () => ipcRenderer.invoke('window:hide'),
  quit: () => ipcRenderer.invoke('app:quit')
});
