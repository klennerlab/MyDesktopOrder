const { app, BrowserWindow, ipcMain, shell, screen, Tray, Menu, nativeImage, dialog, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec, execFile, spawn } = require('child_process');
const https = require('https');

const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';

let win = null;
let tray = null;
let data = null;
let dataPath = null;
let saveTimer = null;

const DEFAULT_DATA = {
  projects: [],
  logos: [],
  favicons: {},
  window: null,
  settings: {
    alwaysOnTop: false,
    openAtLogin: false,
    language: null,
    locked: false,
    scheme: 'steel'
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

  if (data.settings.locked) {
    win.setMovable(false);
    win.setResizable(false);
  }

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

function showWindow() {
  if (!win || win.isDestroyed()) {
    createWindow();
  } else {
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  }
}

function trayLang() {
  const pref = data.settings.language || (app.getLocale().toLowerCase().startsWith('de') ? 'de' : 'en');
  return pref === 'de'
    ? { show: 'Meine Projekte anzeigen', quit: 'Beenden' }
    : { show: 'Show My Projects', quit: 'Quit' };
}

function updateTrayMenu() {
  if (!tray) return;
  const t = trayLang();
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: t.show, click: showWindow },
      { type: 'separator' },
      { label: t.quit, click: () => app.quit() }
    ])
  );
}

function createTray() {
  const iconPath = isMac
    ? path.join(__dirname, 'assets', 'trayTemplate.png')
    : path.join(__dirname, 'assets', 'tray-win.png');
  const icon = nativeImage.createFromPath(iconPath);
  if (isMac) icon.setTemplateImage(true);
  tray = new Tray(icon);
  tray.setToolTip('My Desktop Order');
  updateTrayMenu();
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
    createTray();

    // Global shortcut: show/hide the widget from anywhere
    try {
      globalShortcut.register('CommandOrControl+Alt+P', () => {
        if (win && !win.isDestroyed() && win.isVisible()) win.hide();
        else showWindow();
      });
    } catch {
      // another app may own the shortcut — not critical
    }

    app.on('activate', showWindow);
  });
}

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// The app lives in the tray/menu bar — closing the window does not quit it.
app.on('window-all-closed', () => {});

// ---- IPC ----

ipcMain.handle('state:get', () => ({
  projects: data.projects,
  logos: data.logos,
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

ipcMain.handle('lock:set', (event, value) => {
  data.settings.locked = !!value;
  if (win) {
    win.setMovable(!data.settings.locked);
    win.setResizable(!data.settings.locked);
  }
  persist();
  return data.settings.locked;
});

ipcMain.handle('scheme:set', (event, value) => {
  if (typeof value === 'string' && value.length <= 30) {
    data.settings.scheme = value;
    persist();
  }
  return data.settings.scheme;
});

ipcMain.handle('lang:set', (event, value) => {
  data.settings.language = value === 'de' || value === 'en' ? value : null;
  persist();
  updateTrayMenu();
  return data.settings.language;
});

// ---- Favicons: fetched once directly from the site itself, then cached locally ----

const FAVICON_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function fetchUrl(url, maxBytes, redirectsLeft = 4) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 8000, headers: { 'User-Agent': FAVICON_UA, Accept: '*/*' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
        res.resume();
        const next = new URL(res.headers.location, url).href;
        if (!next.startsWith('https:')) return reject(new Error('non-https redirect'));
        return resolve(fetchUrl(next, maxBytes, redirectsLeft - 1));
      }
      const type = (res.headers['content-type'] || '').split(';')[0].trim();
      const chunks = [];
      let size = 0;
      res.on('data', (chunk) => {
        size += chunk.length;
        if (size > maxBytes) {
          // keep what we have — for HTML pages the <head> is at the top anyway
          req.destroy();
          resolve({ status: res.statusCode, type, buffer: Buffer.concat(chunks), baseUrl: url });
        } else {
          chunks.push(chunk);
        }
      });
      res.on('end', () => resolve({ status: res.statusCode, type, buffer: Buffer.concat(chunks), baseUrl: url }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

async function tryFaviconIco(host) {
  const res = await fetchUrl(`https://${host}/favicon.ico`, 300 * 1024);
  if (res.status !== 200 || !res.type.startsWith('image/') || !res.buffer.length) {
    throw new Error('no direct favicon');
  }
  return `data:${res.type};base64,${res.buffer.toString('base64')}`;
}

async function tryFaviconFromHtml(host) {
  const page = await fetchUrl(`https://${host}/`, 500 * 1024);
  if (page.status !== 200 || !page.type.startsWith('text/html')) throw new Error('no html');
  const html = page.buffer.toString('utf8');
  const linkTag = html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*>/i);
  if (!linkTag) throw new Error('no icon link');
  const href = (linkTag[0].match(/href=["']([^"']+)["']/i) || [])[1];
  if (!href) throw new Error('no href');
  if (href.startsWith('data:image/')) return href;
  const iconUrl = new URL(href, page.baseUrl).href;
  if (!iconUrl.startsWith('https:')) throw new Error('non-https icon');
  const icon = await fetchUrl(iconUrl, 300 * 1024);
  if (icon.status !== 200 || !icon.type.startsWith('image/') || !icon.buffer.length) {
    throw new Error('icon fetch failed');
  }
  return `data:${icon.type};base64,${icon.buffer.toString('base64')}`;
}

// ap.www.example.com → [ap.www.example.com, www.example.com, example.com, www.example.com]
function hostCandidates(hostname) {
  const candidates = [hostname];
  let host = hostname;
  while (host.split('.').length > 2) {
    host = host.split('.').slice(1).join('.');
    candidates.push(host);
  }
  const root = candidates[candidates.length - 1];
  if (!hostname.startsWith('www.')) candidates.push('www.' + root);
  return [...new Set(candidates)].slice(0, 4);
}

const faviconFailures = new Set();

ipcMain.handle('favicon:get', async (event, hostname) => {
  if (typeof hostname !== 'string' || !/^[a-z0-9.-]{1,253}$/i.test(hostname)) return null;
  if (!data.favicons) data.favicons = {};
  if (data.favicons[hostname]) return data.favicons[hostname];
  if (faviconFailures.has(hostname)) return null;

  const candidates = hostCandidates(hostname);
  for (const attempt of [tryFaviconIco, tryFaviconFromHtml]) {
    for (const host of candidates) {
      try {
        const dataUrl = await attempt(host);
        data.favicons[hostname] = dataUrl;
        persist();
        return dataUrl;
      } catch {
        // try next candidate / strategy
      }
    }
  }
  faviconFailures.add(hostname);
  return null;
});

ipcMain.handle('logo:pick', async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'] }]
  });
  if (result.canceled || !result.filePaths.length) return null;

  const img = nativeImage.createFromPath(result.filePaths[0]);
  if (img.isEmpty()) return null;

  const { width, height } = img.getSize();
  const factor = Math.min(1, 128 / Math.max(width, height));
  const resized =
    factor < 1
      ? img.resize({ width: Math.round(width * factor), height: Math.round(height * factor), quality: 'best' })
      : img;
  const dataUrl = resized.toDataURL();

  if (!Array.isArray(data.logos)) data.logos = [];
  if (!data.logos.includes(dataUrl)) data.logos.push(dataUrl);
  persist();
  return { logos: data.logos, picked: dataUrl };
});

// ---- Bookmarks import (Chrome / Edge / Brave — read from their local files) ----

function isValidHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function chromiumBookmarkFiles() {
  const home = app.getPath('home');
  const bases = isMac
    ? {
        Chrome: path.join(home, 'Library/Application Support/Google/Chrome'),
        Edge: path.join(home, 'Library/Application Support/Microsoft Edge'),
        Brave: path.join(home, 'Library/Application Support/BraveSoftware/Brave-Browser')
      }
    : isWin
      ? {
          Chrome: path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/User Data'),
          Edge: path.join(process.env.LOCALAPPDATA || '', 'Microsoft/Edge/User Data'),
          Brave: path.join(process.env.LOCALAPPDATA || '', 'BraveSoftware/Brave-Browser/User Data')
        }
      : {};
  const files = [];
  for (const [browser, base] of Object.entries(bases)) {
    let entries = [];
    try {
      entries = fs.readdirSync(base).filter((e) => e === 'Default' || /^Profile \d+$/.test(e));
    } catch {
      continue;
    }
    for (const profile of entries) {
      const file = path.join(base, profile, 'Bookmarks');
      if (fs.existsSync(file)) files.push({ browser, profile, file });
    }
  }
  return files;
}

function collectBookmarkFolders(node, folders) {
  if (!node || node.type !== 'folder' || !Array.isArray(node.children)) return;
  const sites = node.children
    .filter((c) => c.type === 'url' && isValidHttpUrl(c.url))
    .map((c) => ({ title: c.name || '', url: c.url }));
  if (sites.length) folders.push({ name: node.name || 'Bookmarks', sites });
  for (const child of node.children) collectBookmarkFolders(child, folders);
}

ipcMain.handle('bookmarks:read', () => {
  const files = chromiumBookmarkFiles();
  const result = [];
  const multipleSources = files.length > 1;
  for (const { browser, profile, file } of files) {
    try {
      const json = JSON.parse(fs.readFileSync(file, 'utf8'));
      const folders = [];
      for (const root of Object.values(json.roots || {})) collectBookmarkFolders(root, folders);
      const label = multipleSources ? `${browser}${profile === 'Default' ? '' : ' · ' + profile}` : '';
      for (const folder of folders) result.push({ ...folder, label });
    } catch {
      // unreadable profile — skip
    }
  }
  return result;
});

// ---- Export / import projects as a local file ----

ipcMain.handle('file:export', async () => {
  const result = await dialog.showSaveDialog(win, {
    defaultPath: 'my-desktop-order-projects.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (result.canceled || !result.filePath) return false;
  try {
    const payload = {
      app: 'my-desktop-order',
      kind: 'export',
      version: app.getVersion(),
      projects: data.projects,
      logos: data.logos
    };
    fs.writeFileSync(result.filePath, JSON.stringify(payload, null, 2));
    return true;
  } catch {
    return false;
  }
});

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

ipcMain.handle('file:exportHtml', async () => {
  const de = (data.settings.language || app.getLocale().toLowerCase()).startsWith('de');
  const t = de
    ? { title: 'Meine Projekte', sites: 'Seiten', site: 'Seite', file: 'meine-projekte.html', footer: 'Erstellt mit My Desktop Order' }
    : { title: 'My Projects', sites: 'sites', site: 'site', file: 'my-projects.html', footer: 'Created with My Desktop Order' };

  const result = await dialog.showSaveDialog(win, {
    defaultPath: t.file,
    filters: [{ name: 'HTML', extensions: ['html'] }]
  });
  if (result.canceled || !result.filePath) return false;

  const sections = data.projects
    .map((project) => {
      const icon = typeof project.icon === 'string' && !project.icon.startsWith('data:') ? project.icon + ' ' : '';
      const note = project.note ? `<p class="note">${escapeHtml(project.note)}</p>` : '';
      const rows = project.sites
        .map((site) => {
          const siteNote = site.note ? ` <span class="note">— ${escapeHtml(site.note)}</span>` : '';
          return `<li><a href="${escapeHtml(site.url)}">${escapeHtml(site.title || site.url)}</a> <span class="url">${escapeHtml(site.url)}</span>${siteNote}</li>`;
        })
        .join('\n');
      const count = `${project.sites.length} ${project.sites.length === 1 ? t.site : t.sites}`;
      return `<section><h2>${icon}${escapeHtml(project.name)} <span class="count">(${count})</span></h2>${note}<ul>${rows}</ul></section>`;
    })
    .join('\n');

  const html = `<!doctype html>
<html lang="${de ? 'de' : 'en'}">
<head>
<meta charset="utf-8">
<title>${t.title}</title>
<style>
  body { font-family: -apple-system, "Segoe UI", system-ui, sans-serif; max-width: 760px; margin: 40px auto; padding: 0 20px; color: #1a2230; line-height: 1.6; }
  h1 { border-bottom: 2px solid #5e88ab; padding-bottom: 8px; }
  h2 { margin-top: 28px; margin-bottom: 4px; }
  .count { color: #7d8794; font-weight: 400; font-size: 0.8em; }
  ul { margin: 6px 0 0 0; padding-left: 22px; }
  li { margin: 4px 0; }
  a { color: #2f6ca8; }
  .url { color: #7d8794; font-size: 0.85em; }
  .note { color: #55606e; font-style: italic; font-size: 0.9em; margin: 2px 0; }
  footer { margin-top: 40px; color: #7d8794; font-size: 0.85em; border-top: 1px solid #dde3ea; padding-top: 10px; }
</style>
</head>
<body>
<h1>${t.title}</h1>
${sections}
<footer>${t.footer} · https://klennerlab.github.io/MyDesktopOrder/</footer>
</body>
</html>`;

  try {
    fs.writeFileSync(result.filePath, html);
    shell.openPath(result.filePath);
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle('file:import', async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (result.canceled || !result.filePaths.length) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8'));
    if (raw.app !== 'my-desktop-order' || !Array.isArray(raw.projects)) return { error: 'format' };

    const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
    let imported = 0;
    for (const project of raw.projects) {
      if (!project || typeof project.name !== 'string' || !project.name.trim()) continue;
      const sites = (Array.isArray(project.sites) ? project.sites : [])
        .filter((s) => s && isValidHttpUrl(s.url))
        .map((s) => ({
          id: newId(),
          title: typeof s.title === 'string' ? s.title.slice(0, 60) : '',
          url: s.url,
          ...(typeof s.note === 'string' && s.note ? { note: s.note.slice(0, 500) } : {})
        }));
      data.projects.push({
        id: newId(),
        name: project.name.slice(0, 40),
        icon: typeof project.icon === 'string' ? project.icon : null,
        ...(typeof project.note === 'string' && project.note ? { note: project.note.slice(0, 1000) } : {}),
        sites
      });
      imported += 1;
    }
    if (Array.isArray(raw.logos)) {
      if (!Array.isArray(data.logos)) data.logos = [];
      for (const logo of raw.logos) {
        if (typeof logo === 'string' && logo.startsWith('data:image/') && !data.logos.includes(logo)) {
          data.logos.push(logo);
        }
      }
    }
    persist();
    return { imported, projects: data.projects, logos: data.logos };
  } catch {
    return { error: 'format' };
  }
});

ipcMain.handle('window:hide', () => {
  if (win) win.hide();
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
