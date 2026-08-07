const { app, BrowserWindow, ipcMain, shell, screen } = require('electron');
const path = require('path');
const fs = require('fs');

const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';

let win = null;
let data = null;
let dataPath = null;
let saveTimer = null;

const DEFAULT_DATA = {
  projects: [],
  window: null,
  settings: {
    alwaysOnTop: false,
    openAtLogin: false,
    language: null
  }
};

function loadData() {
  try {
    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    return {
      ...DEFAULT_DATA,
      ...raw,
      settings: { ...DEFAULT_DATA.settings, ...(raw.settings || {}) }
    };
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      fs.mkdirSync(path.dirname(dataPath), { recursive: true });
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Could not save data:', err);
    }
  }, 150);
}

// Only restore a saved position if it is still visible on a connected screen
function clampBounds(b) {
  if (!b) return null;
  const visible = screen.getAllDisplays().some((d) => {
    const a = d.workArea;
    return (
      b.x < a.x + a.width - 40 &&
      b.x + b.width > a.x + 40 &&
      b.y < a.y + a.height - 40 &&
      b.y >= a.y - 10
    );
  });
  return visible ? b : null;
}

function createWindow() {
  const saved = clampBounds(data.window);

  win = new BrowserWindow({
    width: saved ? saved.width : 360,
    height: saved ? saved.height : 540,
    x: saved ? saved.x : undefined,
    y: saved ? saved.y : undefined,
    minWidth: 300,
    minHeight: 400,
    frame: false,
    transparent: isMac,
    backgroundColor: isMac ? undefined : '#1b1f2a',
    vibrancy: isMac ? 'under-window' : undefined,
    visualEffectState: isMac ? 'active' : undefined,
    roundedCorners: true,
    resizable: true,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: false,
    hasShadow: true,
    alwaysOnTop: !!data.settings.alwaysOnTop,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  const saveBounds = () => {
    if (!win || win.isDestroyed()) return;
    data.window = win.getBounds();
    persist();
  };
  win.on('moved', saveBounds);
  win.on('resized', saveBounds);
  win.on('closed', () => {
    win = null;
  });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    dataPath = path.join(app.getPath('userData'), 'data.json');
    data = loadData();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  app.quit();
});

// ---- IPC ----

ipcMain.handle('state:get', () => ({
  projects: data.projects,
  settings: data.settings,
  locale: app.getLocale(),
  platform: process.platform,
  version: app.getVersion()
}));

ipcMain.handle('projects:save', (event, projects) => {
  if (!Array.isArray(projects)) return false;
  data.projects = projects;
  persist();
  return true;
});

ipcMain.handle('urls:open', (event, urls) => {
  if (!Array.isArray(urls)) return 0;
  let opened = 0;
  for (const url of urls) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        shell.openExternal(url);
        opened += 1;
      }
    } catch {
      // ignore invalid URLs
    }
  }
  return opened;
});

ipcMain.handle('pin:set', (event, value) => {
  data.settings.alwaysOnTop = !!value;
  if (win) win.setAlwaysOnTop(!!value);
  persist();
  return data.settings.alwaysOnTop;
});

ipcMain.handle('autostart:set', (event, value) => {
  data.settings.openAtLogin = !!value;
  app.setLoginItemSettings({ openAtLogin: !!value });
  persist();
  return data.settings.openAtLogin;
});

ipcMain.handle('lang:set', (event, value) => {
  data.settings.language = value === 'de' || value === 'en' ? value : null;
  persist();
  return data.settings.language;
});

ipcMain.handle('link:external', (event, url) => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') shell.openExternal(url);
  } catch {
    // ignore
  }
});

ipcMain.handle('app:quit', () => {
  app.quit();
});
