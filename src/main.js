const { app, BrowserWindow, ipcMain, shell, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec, execFile, spawn } = require('child_process');

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

// ---- Opening URLs in a NEW browser window (instead of tabs in an existing one) ----

const MAC_CHROMIUM_PATHS = {
  'com.google.chrome': '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'com.microsoft.edgemac': '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  'com.brave.browser': '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  'com.vivaldi.vivaldi': '/Applications/Vivaldi.app/Contents/MacOS/Vivaldi',
  'com.operasoftware.opera': '/Applications/Opera.app/Contents/MacOS/Opera',
  'org.chromium.chromium': '/Applications/Chromium.app/Contents/MacOS/Chromium'
};

function macDefaultBrowserId() {
  return new Promise((resolve) => {
    exec(
      'plutil -convert json -o - "$HOME/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist"',
      { maxBuffer: 10 * 1024 * 1024 },
      (err, out) => {
        if (err) return resolve(null);
        try {
          const json = JSON.parse(out);
          const handler = (json.LSHandlers || []).find(
            (h) => h.LSHandlerURLScheme === 'https' || h.LSHandlerURLScheme === 'http'
          );
          resolve(handler ? handler.LSHandlerRoleAll || handler.LSHandlerRoleViewer || null : null);
        } catch {
          resolve(null);
        }
      }
    );
  });
}

async function openInNewWindowMac(urls) {
  const id = ((await macDefaultBrowserId()) || '').toLowerCase();
  if (!id) return false;

  const chromiumBinary = MAC_CHROMIUM_PATHS[id];
  if (chromiumBinary && fs.existsSync(chromiumBinary)) {
    spawn(chromiumBinary, ['--new-window', ...urls], { detached: true, stdio: 'ignore' }).unref();
    return true;
  }
  if (id.includes('safari')) {
    const lines = [
      'tell application "Safari"',
      'activate',
      `make new document with properties {URL:${JSON.stringify(urls[0])}}`,
      ...urls
        .slice(1)
        .map(
          (u) =>
            `tell front window to set current tab to (make new tab with properties {URL:${JSON.stringify(u)}})`
        ),
      'end tell'
    ];
    execFile('osascript', lines.flatMap((l) => ['-e', l]));
    return true;
  }
  if (id.includes('firefox')) {
    const firefox = '/Applications/Firefox.app/Contents/MacOS/firefox';
    if (fs.existsSync(firefox)) {
      spawn(firefox, ['--new-window', urls[0]], { detached: true, stdio: 'ignore' }).unref();
      if (urls.length > 1) {
        setTimeout(() => {
          spawn(firefox, urls.slice(1), { detached: true, stdio: 'ignore' }).unref();
        }, 1500);
      }
      return true;
    }
  }
  return false;
}

function openInNewWindowWin(urls) {
  return new Promise((resolve) => {
    exec(
      'reg query "HKCU\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\https\\UserChoice" /v ProgId',
      (err, out) => {
        const progId = err ? '' : String(out);
        let exe = null;
        if (/ChromeHTML/i.test(progId)) exe = 'chrome';
        else if (/MSEdgeHTM/i.test(progId)) exe = 'msedge';
        else if (/Brave/i.test(progId)) exe = 'brave';
        else if (/Opera/i.test(progId)) exe = 'opera';
        else if (/Vivaldi/i.test(progId)) exe = 'vivaldi';
        else if (/Firefox/i.test(progId)) exe = 'firefox';
        if (!exe) return resolve(false);
        spawn('cmd', ['/c', 'start', '', exe, '--new-window', ...urls], {
          detached: true,
          stdio: 'ignore',
          windowsHide: true
        }).unref();
        resolve(true);
      }
    );
  });
}

ipcMain.handle('urls:open', async (event, urls, opts) => {
  if (!Array.isArray(urls)) return 0;
  const valid = [];
  for (const url of urls) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') valid.push(url);
    } catch {
      // ignore invalid URLs
    }
  }
  if (!valid.length) return 0;

  if (opts && opts.newWindow) {
    try {
      const ok = isMac
        ? await openInNewWindowMac(valid)
        : isWin
          ? await openInNewWindowWin(valid)
          : false;
      if (ok) return valid.length;
    } catch {
      // fall through to default behavior
    }
  }
  for (const url of valid) shell.openExternal(url);
  return valid.length;
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
