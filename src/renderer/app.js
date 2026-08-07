const $ = (id) => document.getElementById(id);

const GITHUB_URL = 'https://github.com/klennerlab/MyDesktopOrder';

const EMOJIS = [
  '📁', '💼', '🌐', '⚽', '🐴', '🏆',
  '🎨', '📚', '💻', '📝', '🎵', '🎬',
  '🛒', '✈️', '🏠', '❤️', '⭐', '🔥',
  '🍀', '🎯', '📊', '🧩', '📷', '🍕'
];

const SCHEMES = [
  { id: 'steel',    de: 'Stahlblau',  en: 'Steel Blue',   g1: '#9dc0da', g2: '#5e88ab', accent: '#6e9fc4', hover: '#85b4d6', dark: '#0c1826', bg: '12, 19, 27',  tint: '157, 192, 218' },
  { id: 'graphite', de: 'Graphit',    en: 'Graphite',     g1: '#c9ced8', g2: '#838d9c', accent: '#98a4b4', hover: '#aeb9c8', dark: '#12151b', bg: '13, 15, 20',  tint: '201, 206, 216' },
  { id: 'rose',     de: 'Roségold',   en: 'Rose Gold',    g1: '#e6b8ae', g2: '#b07a72', accent: '#c4938a', hover: '#d6a89f', dark: '#1f1210', bg: '24, 15, 15',  tint: '230, 184, 174' },
  { id: 'ruby',     de: 'Rubinrot',   en: 'Ruby Red',     g1: '#e19097', g2: '#a84a58', accent: '#c06a75', hover: '#d28590', dark: '#200e12', bg: '25, 13, 16',  tint: '225, 144, 151' },
  { id: 'emerald',  de: 'Smaragd',    en: 'Emerald',      g1: '#96d2b4', g2: '#469372', accent: '#62ab8c', hover: '#7cc0a2', dark: '#0d1f18', bg: '11, 22, 17',  tint: '150, 210, 180' },
  { id: 'sage',     de: 'Salbei',     en: 'Sage Green',   g1: '#becbb2', g2: '#7e9070', accent: '#93a687', hover: '#a8bb9c', dark: '#151a11', bg: '16, 21, 15',  tint: '190, 203, 178' },
  { id: 'amethyst', de: 'Amethyst',   en: 'Amethyst',     g1: '#c5abe2', g2: '#7f60ab', accent: '#9a7cc2', hover: '#ae92d4', dark: '#170f22', bg: '19, 15, 26',  tint: '197, 171, 226' },
  { id: 'amber',    de: 'Bernstein',  en: 'Amber Gold',   g1: '#e9d09c', g2: '#b08f52', accent: '#c6a468', hover: '#d8b87e', dark: '#201705', bg: '23, 18, 8',   tint: '233, 208, 156' },
  { id: 'ocean',    de: 'Ozean',      en: 'Ocean Teal',   g1: '#93d7d7', g2: '#47929e', accent: '#64abb4', hover: '#7dc2ca', dark: '#0b1d1f', bg: '10, 21, 23',  tint: '147, 215, 215' },
  { id: 'sunset',   de: 'Koralle',    en: 'Coral Sunset', g1: '#f0b593', g2: '#c17049', accent: '#d18a64', hover: '#e0a078', dark: '#221108', bg: '25, 15, 10',  tint: '240, 181, 147' }
];

function applyScheme(id) {
  const scheme = SCHEMES.find((s) => s.id === id) || SCHEMES[0];
  const root = document.documentElement.style;
  root.setProperty('--steel', `linear-gradient(180deg, ${scheme.g1} 0%, ${scheme.g2} 100%)`);
  root.setProperty('--steel-text', scheme.dark);
  root.setProperty('--accent', scheme.accent);
  root.setProperty('--accent-hover', scheme.hover);
  root.setProperty('--bg-rgb', scheme.bg);
  root.setProperty('--tint-rgb', scheme.tint);
  document.body.dataset.scheme = scheme.id;
}

const I18N = {
  de: {
    myProjects: 'Meine Projekte',
    newProject: '＋ Neues Projekt',
    editProject: 'Projekt bearbeiten',
    createProject: 'Neues Projekt',
    projectName: 'Name',
    projectIcon: 'Icon',
    save: 'Speichern',
    cancel: 'Abbrechen',
    deleteProjectConfirm: 'Projekt „{name}“ wirklich löschen?',
    emptyProjects: 'Erstelle dein erstes Projekt!',
    noIcon: 'Ohne Icon – der Titel füllt das Feld',
    emptySites: 'Noch keine Webseiten in diesem Projekt.\nFüge deine erste Seite hinzu!',
    openAll: 'Alle öffnen',
    openSelected: 'Ausgewählte öffnen ({n})',
    addSite: '＋ Seite hinzufügen',
    addSiteTitle: 'Seite hinzufügen',
    siteName: 'Titel (optional)',
    siteUrl: 'Adresse (URL)',
    removeSiteConfirm: '„{name}“ aus dem Projekt entfernen?',
    sites: 'Seiten',
    site: 'Seite',
    pin: 'Immer im Vordergrund',
    lock: 'Sticker-Modus: Position fixieren',
    schemeMenu: 'Farbschema wählen',
    schemeTitle: 'Farbschema',
    back: 'Zurück',
    close: 'Schließen',
    menu: 'Menü',
    autostartOn: '✓ Beim Anmelden starten',
    autostartOff: 'Beim Anmelden starten',
    github: 'Auf GitHub ansehen',
    language: 'Language: English',
    quit: 'Beenden',
    invalidUrl: 'Bitte gib eine gültige Adresse ein, z. B. https://www.notion.com'
  },
  en: {
    myProjects: 'My Projects',
    newProject: '＋ New Project',
    editProject: 'Edit project',
    createProject: 'New project',
    projectName: 'Name',
    projectIcon: 'Icon',
    save: 'Save',
    cancel: 'Cancel',
    deleteProjectConfirm: 'Really delete project "{name}"?',
    emptyProjects: 'Create your first project!',
    noIcon: 'No icon – the title fills the tile',
    emptySites: 'No websites in this project yet.\nAdd your first site!',
    openAll: 'Open all',
    openSelected: 'Open selected ({n})',
    addSite: '＋ Add site',
    addSiteTitle: 'Add site',
    siteName: 'Title (optional)',
    siteUrl: 'Address (URL)',
    removeSiteConfirm: 'Remove "{name}" from this project?',
    sites: 'sites',
    site: 'site',
    pin: 'Always on top',
    lock: 'Sticker mode: lock position',
    schemeMenu: 'Choose color scheme',
    schemeTitle: 'Color scheme',
    back: 'Back',
    close: 'Close',
    menu: 'Menu',
    autostartOn: '✓ Start at login',
    autostartOff: 'Start at login',
    github: 'View on GitHub',
    language: 'Sprache: Deutsch',
    quit: 'Quit',
    invalidUrl: 'Please enter a valid address, e.g. https://www.notion.com'
  }
};

let L = I18N.en;
let projects = [];
let settings = { alwaysOnTop: false, openAtLogin: false };
let currentProjectId = null;
let selectedSites = new Set();
let editingProjectId = null; // null = creating a new project
let chosenEmoji = null; // null = no icon, title fills the tile

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

const fmt = (str, vars = {}) =>
  str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

function currentProject() {
  return projects.find((p) => p.id === currentProjectId) || null;
}

function saveProjects() {
  window.api.saveProjects(projects);
}

function normalizeUrl(input) {
  let value = input.trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) value = 'https://' + value;
  try {
    const parsed = new URL(value);
    if (!parsed.hostname.includes('.')) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

// ---- Rendering ----

function renderHome() {
  $('view-project').hidden = true;
  $('view-home').hidden = false;
  $('footer-home').hidden = false;
  $('header-title').textContent = L.myProjects;
  currentProjectId = null;
  selectedSites.clear();

  const grid = $('project-grid');
  grid.innerHTML = '';
  $('empty-state').hidden = projects.length > 0;

  for (const project of projects) {
    const tile = document.createElement('div');
    tile.className = 'project-tile';
    tile.title = project.name;

    const name = document.createElement('div');
    name.className = 'tile-name';
    name.textContent = project.name;

    const count = document.createElement('div');
    count.className = 'tile-count';
    const n = project.sites.length;
    count.textContent = `${n} ${n === 1 ? L.site : L.sites}`;

    if (project.icon) {
      const icon = document.createElement('div');
      icon.className = 'tile-icon';
      icon.textContent = project.icon;
      tile.append(icon, name, count);
    } else {
      tile.classList.add('no-icon');
      tile.append(name, count);
    }
    tile.addEventListener('click', () => openProject(project.id));
    grid.appendChild(tile);
  }
}

function openProject(id) {
  currentProjectId = id;
  selectedSites.clear();
  renderProject();
}

function renderProject() {
  const project = currentProject();
  if (!project) return renderHome();

  $('view-home').hidden = true;
  $('footer-home').hidden = true;
  $('view-project').hidden = false;
  $('header-title').textContent = L.myProjects;
  $('project-icon').textContent = project.icon || '';
  $('project-name').textContent = project.name;

  const list = $('site-list');
  list.innerHTML = '';
  $('site-empty').hidden = project.sites.length > 0;

  for (const site of project.sites) {
    const row = document.createElement('div');
    row.className = 'site-row';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selectedSites.has(site.id);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selectedSites.add(site.id);
      else selectedSites.delete(site.id);
      updateOpenSelectedButton();
    });

    let hostname = '';
    try {
      hostname = new URL(site.url).hostname;
    } catch {
      hostname = '';
    }

    const favicon = document.createElement('img');
    favicon.className = 'site-favicon';
    favicon.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=64`;
    favicon.addEventListener('error', () => {
      const fallback = document.createElement('div');
      fallback.className = 'site-favicon-fallback';
      fallback.textContent = '🌐';
      favicon.replaceWith(fallback);
    });

    const info = document.createElement('div');
    info.className = 'site-info';
    info.title = site.url;

    const title = document.createElement('div');
    title.className = 'site-title';
    title.textContent = site.title || hostname;

    const urlLine = document.createElement('div');
    urlLine.className = 'site-url';
    urlLine.textContent = hostname || site.url;

    info.append(title, urlLine);
    info.addEventListener('click', () => window.api.openUrls([site.url]));

    const remove = document.createElement('button');
    remove.className = 'icon-btn danger site-remove';
    remove.textContent = '✕';
    remove.title = L.close;
    remove.addEventListener('click', () => {
      if (!confirm(fmt(L.removeSiteConfirm, { name: site.title || hostname }))) return;
      project.sites = project.sites.filter((s) => s.id !== site.id);
      selectedSites.delete(site.id);
      saveProjects();
      renderProject();
    });

    row.append(checkbox, favicon, info, remove);
    list.appendChild(row);
  }

  $('btn-open-all').textContent = L.openAll;
  $('btn-open-all').disabled = project.sites.length === 0;
  $('btn-add-site').textContent = L.addSite;
  updateOpenSelectedButton();
}

function updateOpenSelectedButton() {
  const btn = $('btn-open-selected');
  btn.textContent = fmt(L.openSelected, { n: selectedSites.size });
  btn.disabled = selectedSites.size === 0;
}

// ---- Project modal (create / edit) ----

function openProjectModal(projectId) {
  editingProjectId = projectId || null;
  const project = projectId ? projects.find((p) => p.id === projectId) : null;

  $('modal-project-title').textContent = project ? L.editProject : L.createProject;
  $('input-project-name').value = project ? project.name : '';
  chosenEmoji = project ? project.icon || null : null;
  renderEmojiGrid();
  $('modal-project').hidden = false;
  $('input-project-name').focus();
}

function renderEmojiGrid() {
  const grid = $('emoji-grid');
  grid.innerHTML = '';

  const none = document.createElement('button');
  none.type = 'button';
  none.className = 'no-icon-option';
  none.textContent = 'Aa';
  none.title = L.noIcon;
  if (!chosenEmoji) none.classList.add('selected');
  none.addEventListener('click', () => {
    chosenEmoji = null;
    renderEmojiGrid();
  });
  grid.appendChild(none);

  for (const emoji of EMOJIS) {
    const btn = document.createElement('button');
    btn.textContent = emoji;
    btn.type = 'button';
    if (emoji === chosenEmoji) btn.classList.add('selected');
    btn.addEventListener('click', () => {
      chosenEmoji = emoji;
      renderEmojiGrid();
    });
    grid.appendChild(btn);
  }
}

function saveProjectModal() {
  const name = $('input-project-name').value.trim();
  if (!name) {
    $('input-project-name').focus();
    return;
  }
  if (editingProjectId) {
    const project = projects.find((p) => p.id === editingProjectId);
    if (project) {
      project.name = name;
      project.icon = chosenEmoji;
    }
  } else {
    projects.push({ id: uid(), name, icon: chosenEmoji, sites: [] });
  }
  saveProjects();
  $('modal-project').hidden = true;
  if (currentProjectId) renderProject();
  else renderHome();
}

// ---- Site modal ----

function openSiteModal() {
  $('modal-site-title').textContent = L.addSiteTitle;
  $('input-site-name').value = '';
  $('input-site-url').value = '';
  $('modal-site').hidden = false;
  $('input-site-url').focus();
}

function saveSiteModal() {
  const project = currentProject();
  if (!project) return;

  const url = normalizeUrl($('input-site-url').value);
  if (!url) {
    alert(L.invalidUrl);
    $('input-site-url').focus();
    return;
  }
  let title = $('input-site-name').value.trim();
  if (!title) {
    try {
      title = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      title = url;
    }
  }
  project.sites.push({ id: uid(), title, url });
  saveProjects();
  $('modal-site').hidden = true;
  renderProject();
}

// ---- Menu ----

function renderSchemeModal() {
  $('modal-scheme-title').textContent = L.schemeTitle;
  $('btn-scheme-close').textContent = L.cancel;
  const grid = $('scheme-grid');
  grid.innerHTML = '';
  const lang = currentLangCode();
  for (const scheme of SCHEMES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'scheme-option';
    if (document.body.dataset.scheme === scheme.id) btn.classList.add('selected');

    const swatch = document.createElement('span');
    swatch.className = 'scheme-swatch';
    swatch.style.background = `linear-gradient(135deg, ${scheme.g1}, ${scheme.g2})`;

    const name = document.createElement('span');
    name.textContent = lang === 'de' ? scheme.de : scheme.en;

    btn.append(swatch, name);
    btn.addEventListener('click', async () => {
      settings.scheme = await window.api.setScheme(scheme.id);
      applyScheme(scheme.id);
      renderSchemeModal();
    });
    grid.appendChild(btn);
  }
}

function renderMenu() {
  $('menu-language').textContent = L.language;
  $('menu-scheme').textContent = L.schemeMenu;
  $('menu-autostart').textContent = settings.openAtLogin ? L.autostartOn : L.autostartOff;
  $('menu-github').textContent = L.github;
  $('menu-quit').textContent = L.quit;
}

function currentLangCode() {
  return L === I18N.de ? 'de' : 'en';
}

function refreshUi() {
  applyTexts();
  if (currentProjectId) renderProject();
  else renderHome();
}

// ---- Static texts ----

function applyTexts() {
  $('header-title').textContent = L.myProjects;
  $('btn-new-project').textContent = L.newProject;
  $('empty-text').textContent = L.emptyProjects;
  $('site-empty-text').textContent = L.emptySites;
  $('btn-pin').title = L.pin;
  $('btn-lock').title = L.lock;
  $('btn-menu').title = L.menu;
  $('btn-close').title = L.close;
  $('btn-back').textContent = '‹';
  $('btn-back').title = L.back;
  $('btn-edit-project').title = L.editProject;
  $('btn-delete-project').title = L.deleteProjectConfirm.split('{')[0].trim();
  $('label-project-name').textContent = L.projectName;
  $('label-project-icon').textContent = L.projectIcon;
  $('btn-project-cancel').textContent = L.cancel;
  $('btn-project-save').textContent = L.save;
  $('label-site-name').textContent = L.siteName;
  $('label-site-url').textContent = L.siteUrl;
  $('btn-site-cancel').textContent = L.cancel;
  $('btn-site-save').textContent = L.save;
  $('btn-pin').textContent = '📌';
  renderMenu();
}

// ---- Init ----

async function init() {
  const state = await window.api.getState();
  projects = state.projects || [];
  settings = state.settings || settings;
  const langPref =
    settings.language || ((state.locale || '').toLowerCase().startsWith('de') ? 'de' : 'en');
  L = langPref === 'de' ? I18N.de : I18N.en;

  document.body.classList.add(
    state.platform === 'darwin' ? 'mac' : state.platform === 'win32' ? 'win' : 'linux'
  );

  applyTexts();
  $('btn-pin').classList.toggle('active', !!settings.alwaysOnTop);
  applyScheme(settings.scheme || 'steel');
  $('btn-lock').classList.toggle('active', !!settings.locked);
  document.body.classList.toggle('locked', !!settings.locked);
  $('tape').hidden = !settings.locked;
  renderHome();

  // Header buttons
  $('btn-close').addEventListener('click', () => window.api.quit());
  $('btn-pin').addEventListener('click', async () => {
    settings.alwaysOnTop = await window.api.setPin(!settings.alwaysOnTop);
    $('btn-pin').classList.toggle('active', !!settings.alwaysOnTop);
  });
  $('btn-lock').addEventListener('click', async () => {
    settings.locked = await window.api.setLock(!settings.locked);
    $('btn-lock').classList.toggle('active', !!settings.locked);
    document.body.classList.toggle('locked', !!settings.locked);
    $('tape').hidden = !settings.locked;
  });
  $('btn-menu').addEventListener('click', (event) => {
    event.stopPropagation();
    $('menu').hidden = !$('menu').hidden;
  });
  document.addEventListener('click', (event) => {
    if (!$('menu').hidden && !$('menu').contains(event.target)) $('menu').hidden = true;
  });

  // Menu
  $('menu-language').addEventListener('click', async () => {
    const next = currentLangCode() === 'de' ? 'en' : 'de';
    settings.language = await window.api.setLanguage(next);
    L = settings.language === 'de' ? I18N.de : I18N.en;
    refreshUi();
    $('menu').hidden = true;
  });
  $('menu-scheme').addEventListener('click', () => {
    renderSchemeModal();
    $('modal-scheme').hidden = false;
    $('menu').hidden = true;
  });
  $('btn-scheme-close').addEventListener('click', () => ($('modal-scheme').hidden = true));
  $('menu-autostart').addEventListener('click', async () => {
    settings.openAtLogin = await window.api.setAutostart(!settings.openAtLogin);
    renderMenu();
  });
  $('menu-github').addEventListener('click', () => {
    window.api.openExternal(GITHUB_URL);
    $('menu').hidden = true;
  });
  $('menu-quit').addEventListener('click', () => window.api.quit());

  // Home
  $('btn-new-project').addEventListener('click', () => openProjectModal(null));
  $('empty-state').addEventListener('click', () => openProjectModal(null));
  $('site-empty').addEventListener('click', openSiteModal);

  // Project view
  $('btn-back').addEventListener('click', renderHome);
  $('btn-edit-project').addEventListener('click', () => openProjectModal(currentProjectId));
  $('btn-delete-project').addEventListener('click', () => {
    const project = currentProject();
    if (!project) return;
    if (!confirm(fmt(L.deleteProjectConfirm, { name: project.name }))) return;
    projects = projects.filter((p) => p.id !== project.id);
    saveProjects();
    renderHome();
  });
  $('btn-open-all').addEventListener('click', () => {
    const project = currentProject();
    if (project) window.api.openUrls(project.sites.map((s) => s.url), { newWindow: true });
  });
  $('btn-open-selected').addEventListener('click', () => {
    const project = currentProject();
    if (!project) return;
    const urls = project.sites.filter((s) => selectedSites.has(s.id)).map((s) => s.url);
    if (urls.length) window.api.openUrls(urls, { newWindow: true });
  });
  $('btn-add-site').addEventListener('click', openSiteModal);

  // Modals
  $('btn-project-cancel').addEventListener('click', () => ($('modal-project').hidden = true));
  $('btn-project-save').addEventListener('click', saveProjectModal);
  $('input-project-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveProjectModal();
  });
  $('btn-site-cancel').addEventListener('click', () => ($('modal-site').hidden = true));
  $('btn-site-save').addEventListener('click', saveSiteModal);
  for (const id of ['input-site-name', 'input-site-url']) {
    $(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveSiteModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $('modal-project').hidden = true;
      $('modal-site').hidden = true;
      $('modal-scheme').hidden = true;
      $('menu').hidden = true;
    }
  });
}

init();
