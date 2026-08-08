const $ = (id) => document.getElementById(id);

const GITHUB_URL = 'https://github.com/klennerlab/MyDesktopOrder';

const EMOJIS = [
  '📁', '💼', '🌐', '📝', '💻', '📊',
  '⚽', '🐴', '🏆', '🎾', '🏀', '🏐',
  '🎨', '🎵', '🎬', '📷', '🎭', '🎮',
  '📚', '🎓', '🔬', '🧪', '💡', '🔍',
  '🛒', '💰', '📈', '📉', '🏦', '🧾',
  '✈️', '🚗', '🧳', '🗺️', '🌍', '🏖️',
  '🏠', '🏢', '🏫', '🏥', '🏋️', '🧘',
  '❤️', '💙', '💚', '💛', '🧡', '💜',
  '⭐', '🌟', '✨', '🔥', '⚡', '🚀',
  '🍀', '🌈', '☀️', '🌙', '🌸', '🌿',
  '🎯', '🧩', '🎲', '🥇', '🎁', '🎉',
  '🍕', '🍔', '☕', '🍷', '🎂', '🍎'
];
const EMOJI_PREVIEW_COUNT = 17; // + the "Aa" option = 3 rows of 6

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
    searchPlaceholder: '🔍 Suchen…',
    searchEmpty: 'Nichts gefunden.',
    projectTag: 'Projekt',
    noIcon: 'Ohne Icon – der Titel füllt das Feld',
    emptySites: 'Noch keine Webseiten in diesem Projekt.\nFüge deine erste Seite hinzu!',
    openAll: 'Alle öffnen',
    openSelected: 'Ausgewählte öffnen ({n})',
    addSite: '＋ Seite hinzufügen',
    addSiteTitle: 'Seite hinzufügen',
    editSiteTitle: 'Seite bearbeiten',
    moreIcons: 'Mehr anzeigen ▾',
    lessIcons: 'Weniger anzeigen ▴',
    logoLabel: 'Eigene Logos',
    uploadLogo: '＋ Eigenes Logo hochladen',
    siteName: 'Titel (optional)',
    siteUrl: 'Adresse (URL)',
    removeSiteConfirm: '„{name}“ aus dem Projekt entfernen?',
    duplicateConfirm: 'Diese Seite ist schon im Projekt („{name}“). Trotzdem hinzufügen?',
    noteLabel: 'Notiz (optional)',
    sites: 'Seiten',
    site: 'Seite',
    lock: 'Position fixieren',
    layerMenu: 'Fensterebene',
    layerTitle: 'Fensterebene',
    layerTop: 'Immer im Vordergrund',
    layerNormal: 'Normal (kann verdeckt werden)',
    layerShortTop: 'Vordergrund',
    layerShortNormal: 'Normal',
    languageTitle: 'Sprache',
    dataMenu: 'Import / Export',
    dataTitle: 'Import / Export',
    importBookmarks: '🔖 Browser-Lesezeichen importieren',
    importFile: '📥 Sicherung importieren (.json)',
    exportFile: '📤 Sicherung exportieren (.json)',
    exportHtml: '📄 Liste exportieren (.html, anklickbar)',
    exportDone: '✓ Exportiert!',
    exportFailed: 'Export fehlgeschlagen.',
    importDone: '✓ {n} Projekte importiert',
    importFailed: 'Datei konnte nicht gelesen werden (kein gültiger Export).',
    noBookmarks: 'Keine Browser-Lesezeichen gefunden (unterstützt: Chrome, Edge, Brave).',
    bookmarksTitle: 'Lesezeichen-Ordner wählen',
    importCount: 'Importieren ({n})',
    schemeMenu: 'Farbschema wählen',
    schemeTitle: 'Farbschema',
    back: 'Zurück',
    close: 'Schließen',
    menu: 'Menü',
    autostartMenu: 'Autostart',
    autostartTitle: 'Beim Anmelden starten',
    autostartOn: 'An – App startet automatisch mit dem Computer',
    autostartOff: 'Aus – App manuell starten',
    stateOn: 'An',
    stateOff: 'Aus',
    github: 'Auf GitHub ansehen',
    language: 'Sprache · Deutsch',
    hideWindow: 'Schließen (in Menüleiste)',
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
    searchPlaceholder: '🔍 Search…',
    searchEmpty: 'No results.',
    projectTag: 'Project',
    noIcon: 'No icon – the title fills the tile',
    emptySites: 'No websites in this project yet.\nAdd your first site!',
    openAll: 'Open all',
    openSelected: 'Open selected ({n})',
    addSite: '＋ Add site',
    addSiteTitle: 'Add site',
    editSiteTitle: 'Edit site',
    moreIcons: 'Show more ▾',
    lessIcons: 'Show less ▴',
    logoLabel: 'Your logos',
    uploadLogo: '＋ Upload your own logo',
    siteName: 'Title (optional)',
    siteUrl: 'Address (URL)',
    removeSiteConfirm: 'Remove "{name}" from this project?',
    duplicateConfirm: 'This site is already in the project ("{name}"). Add anyway?',
    noteLabel: 'Note (optional)',
    sites: 'sites',
    site: 'site',
    lock: 'Lock position',
    layerMenu: 'Window layer',
    layerTitle: 'Window layer',
    layerTop: 'Always on top',
    layerNormal: 'Normal (can be covered)',
    layerShortTop: 'On top',
    layerShortNormal: 'Normal',
    languageTitle: 'Language',
    dataMenu: 'Import / Export',
    dataTitle: 'Import / Export',
    importBookmarks: '🔖 Import browser bookmarks',
    importFile: '📥 Import backup (.json)',
    exportFile: '📤 Export backup (.json)',
    exportHtml: '📄 Export list (.html, clickable)',
    exportDone: '✓ Exported!',
    exportFailed: 'Export failed.',
    importDone: '✓ Imported {n} projects',
    importFailed: 'Could not read file (not a valid export).',
    noBookmarks: 'No browser bookmarks found (supported: Chrome, Edge, Brave).',
    bookmarksTitle: 'Choose bookmark folders',
    importCount: 'Import ({n})',
    schemeMenu: 'Choose color scheme',
    schemeTitle: 'Color scheme',
    back: 'Back',
    close: 'Close',
    menu: 'Menu',
    autostartMenu: 'Start at login',
    autostartTitle: 'Start at login',
    autostartOn: 'On – app starts with your computer',
    autostartOff: 'Off – start the app manually',
    stateOn: 'On',
    stateOff: 'Off',
    github: 'View on GitHub',
    language: 'Language · English',
    hideWindow: 'Close (keep in menu bar)',
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
let editingSiteId = null; // null = adding a new site
let chosenIcon = null; // null = no icon; emoji string; or data-URL of an uploaded logo
let emojiExpanded = false;
let logos = [];

const isLogo = (icon) => typeof icon === 'string' && icon.startsWith('data:');

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

  $('search-input').hidden = projects.length === 0;
  const query = $('search-input').value.trim().toLowerCase();
  if (query) return renderSearch(query);

  $('search-results').hidden = true;
  $('search-empty').hidden = true;
  $('project-grid').hidden = false;

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

    if (isLogo(project.icon)) {
      const icon = document.createElement('img');
      icon.className = 'tile-logo';
      icon.src = project.icon;
      tile.append(icon, name, count);
    } else if (project.icon) {
      const icon = document.createElement('div');
      icon.className = 'tile-icon';
      icon.textContent = project.icon;
      tile.append(icon, name, count);
    } else {
      tile.classList.add('no-icon');
      tile.append(name, count);
    }
    tile.addEventListener('click', () => openProject(project.id));

    // Drag & drop reordering
    tile.draggable = true;
    tile.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', project.id);
      e.dataTransfer.effectAllowed = 'move';
      tile.classList.add('dragging');
    });
    tile.addEventListener('dragend', () => tile.classList.remove('dragging'));
    tile.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      tile.classList.add('drag-over');
    });
    tile.addEventListener('dragleave', () => tile.classList.remove('drag-over'));
    tile.addEventListener('drop', (e) => {
      e.preventDefault();
      tile.classList.remove('drag-over');
      const draggedId = e.dataTransfer.getData('text/plain');
      if (!draggedId || draggedId === project.id) return;
      const fromIdx = projects.findIndex((p) => p.id === draggedId);
      const toIdx = projects.findIndex((p) => p.id === project.id);
      if (fromIdx < 0 || toIdx < 0) return;
      const [moved] = projects.splice(fromIdx, 1);
      projects.splice(toIdx, 0, moved);
      saveProjects();
      renderHome();
    });

    grid.appendChild(tile);
  }
}

function openProject(id) {
  currentProjectId = id;
  selectedSites.clear();
  renderProject();
}

function renderSearch(query) {
  $('project-grid').hidden = true;
  $('empty-state').hidden = true;

  const results = $('search-results');
  results.innerHTML = '';
  const matches = (text) => (text || '').toLowerCase().includes(query);
  let count = 0;

  for (const project of projects) {
    if (matches(project.name)) {
      count += 1;
      const row = document.createElement('div');
      row.className = 'site-row';

      const icon = document.createElement('div');
      icon.className = 'site-favicon-fallback';
      icon.textContent = isLogo(project.icon) ? '🗂️' : project.icon || '🗂️';

      const info = document.createElement('div');
      info.className = 'site-info';
      const title = document.createElement('div');
      title.className = 'site-title';
      title.textContent = project.name;
      const tag = document.createElement('div');
      tag.className = 'search-result-project';
      tag.textContent = L.projectTag;
      info.append(title, tag);
      info.addEventListener('click', () => {
        $('search-input').value = '';
        openProject(project.id);
      });

      row.append(icon, info);
      results.appendChild(row);
    }
    for (const site of project.sites) {
      if (!matches(site.title) && !matches(site.url)) continue;
      count += 1;
      const row = document.createElement('div');
      row.className = 'site-row';

      const icon = document.createElement('div');
      icon.className = 'site-favicon-fallback';
      icon.textContent = '🌐';

      const info = document.createElement('div');
      info.className = 'site-info';
      info.title = site.url;
      const title = document.createElement('div');
      title.className = 'site-title';
      title.textContent = site.title;
      const tag = document.createElement('div');
      tag.className = 'search-result-project';
      tag.textContent = `${project.icon && !isLogo(project.icon) ? project.icon + ' ' : ''}${project.name}`;
      info.append(title, tag);
      info.addEventListener('click', () => window.api.openUrls([site.url]));

      row.append(icon, info);
      results.appendChild(row);
    }
  }

  results.hidden = count === 0;
  $('search-empty').hidden = count > 0;
}

function renderProject() {
  const project = currentProject();
  if (!project) return renderHome();

  $('view-home').hidden = true;
  $('footer-home').hidden = true;
  $('view-project').hidden = false;
  $('header-title').textContent = L.myProjects;
  const iconEl = $('project-icon');
  iconEl.textContent = '';
  if (isLogo(project.icon)) {
    const img = document.createElement('img');
    img.className = 'head-logo';
    img.src = project.icon;
    iconEl.appendChild(img);
  } else {
    iconEl.textContent = project.icon || '';
  }
  $('project-name').textContent = project.name;

  const projectNote = $('project-note');
  projectNote.textContent = project.note || '';
  projectNote.hidden = !project.note;

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

    const favicon = document.createElement('div');
    favicon.className = 'site-favicon-fallback';
    favicon.textContent = '🌐';
    if (hostname) {
      window.api.getFavicon(hostname).then((dataUrl) => {
        if (!dataUrl) return;
        const img = document.createElement('img');
        img.className = 'site-favicon';
        img.src = dataUrl;
        favicon.replaceWith(img);
      });
    }

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
    if (site.note) {
      const noteLine = document.createElement('div');
      noteLine.className = 'site-note';
      noteLine.textContent = site.note;
      info.appendChild(noteLine);
      info.title = `${site.url}\n${site.note}`;
    }
    info.addEventListener('click', () => window.api.openUrls([site.url]));

    const edit = document.createElement('button');
    edit.className = 'icon-btn site-action';
    edit.textContent = '✎';
    edit.title = L.editSiteTitle;
    edit.addEventListener('click', () => openSiteModal(site.id));

    const remove = document.createElement('button');
    remove.className = 'icon-btn danger site-action';
    remove.textContent = '✕';
    remove.title = L.close;
    remove.addEventListener('click', () => {
      if (!confirm(fmt(L.removeSiteConfirm, { name: site.title || hostname }))) return;
      project.sites = project.sites.filter((s) => s.id !== site.id);
      selectedSites.delete(site.id);
      saveProjects();
      renderProject();
    });

    // Drag & drop reordering
    row.draggable = true;
    row.dataset.siteId = site.id;
    row.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', site.id);
      e.dataTransfer.effectAllowed = 'move';
      row.classList.add('dragging');
    });
    row.addEventListener('dragend', () => row.classList.remove('dragging'));
    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      row.classList.add('drag-over');
    });
    row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
    row.addEventListener('drop', (e) => {
      e.preventDefault();
      row.classList.remove('drag-over');
      const draggedId = e.dataTransfer.getData('text/plain');
      if (!draggedId || draggedId === site.id) return;
      const fromIdx = project.sites.findIndex((s) => s.id === draggedId);
      const toIdx = project.sites.findIndex((s) => s.id === site.id);
      if (fromIdx < 0 || toIdx < 0) return;
      const [moved] = project.sites.splice(fromIdx, 1);
      project.sites.splice(toIdx, 0, moved);
      saveProjects();
      renderProject();
    });

    row.append(checkbox, favicon, info, edit, remove);
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
  $('input-project-note').value = project ? project.note || '' : '';
  chosenIcon = project ? project.icon || null : null;
  emojiExpanded = false;
  renderEmojiGrid();
  renderLogoGrid();
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
  if (!chosenIcon) none.classList.add('selected');
  none.addEventListener('click', () => {
    chosenIcon = null;
    renderEmojiGrid();
    renderLogoGrid();
  });
  grid.appendChild(none);

  const list = emojiExpanded ? EMOJIS : EMOJIS.slice(0, EMOJI_PREVIEW_COUNT);
  for (const emoji of list) {
    const btn = document.createElement('button');
    btn.textContent = emoji;
    btn.type = 'button';
    if (emoji === chosenIcon) btn.classList.add('selected');
    btn.addEventListener('click', () => {
      chosenIcon = emoji;
      renderEmojiGrid();
      renderLogoGrid();
    });
    grid.appendChild(btn);
  }

  $('btn-toggle-emojis').textContent = emojiExpanded ? L.lessIcons : L.moreIcons;
}

function renderLogoGrid() {
  const grid = $('logo-grid');
  grid.innerHTML = '';
  for (const logo of logos) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'logo-option';
    if (logo === chosenIcon) btn.classList.add('selected');
    const img = document.createElement('img');
    img.src = logo;
    btn.appendChild(img);
    btn.addEventListener('click', () => {
      chosenIcon = logo;
      renderEmojiGrid();
      renderLogoGrid();
    });
    grid.appendChild(btn);
  }
  $('label-project-logo').hidden = logos.length === 0;
}

function saveProjectModal() {
  const name = $('input-project-name').value.trim();
  if (!name) {
    $('input-project-name').focus();
    return;
  }
  const note = $('input-project-note').value.trim();
  if (editingProjectId) {
    const project = projects.find((p) => p.id === editingProjectId);
    if (project) {
      project.name = name;
      project.icon = chosenIcon;
      project.note = note;
    }
  } else {
    projects.push({ id: uid(), name, icon: chosenIcon, note, sites: [] });
  }
  saveProjects();
  $('modal-project').hidden = true;
  if (currentProjectId) renderProject();
  else renderHome();
}

// ---- Site modal ----

function openSiteModal(siteId) {
  editingSiteId = typeof siteId === 'string' ? siteId : null;
  const project = currentProject();
  const site = editingSiteId && project ? project.sites.find((s) => s.id === editingSiteId) : null;

  $('modal-site-title').textContent = site ? L.editSiteTitle : L.addSiteTitle;
  $('input-site-name').value = site ? site.title : '';
  $('input-site-url').value = site ? site.url : '';
  $('input-site-note').value = site ? site.note || '' : '';
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
  const duplicate = project.sites.find(
    (s) => s.id !== editingSiteId && s.url.toLowerCase() === url.toLowerCase()
  );
  if (duplicate && !confirm(fmt(L.duplicateConfirm, { name: duplicate.title }))) return;

  const note = $('input-site-note').value.trim();
  const existing = editingSiteId ? project.sites.find((s) => s.id === editingSiteId) : null;
  if (existing) {
    existing.title = title;
    existing.url = url;
    existing.note = note;
  } else {
    project.sites.push({ id: uid(), title, url, note });
  }
  editingSiteId = null;
  saveProjects();
  $('modal-site').hidden = true;
  renderProject();
}

// ---- Menu ----

function renderSchemeModal() {
  $('modal-scheme-title').textContent = L.schemeTitle;
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

function renderChoiceList(containerId, options, selectedValue, onPick) {
  const list = $(containerId);
  list.innerHTML = '';
  for (const option of options) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-option';
    if (option.value === selectedValue) btn.classList.add('selected');

    const label = document.createElement('span');
    label.textContent = option.label;
    btn.appendChild(label);

    if (option.value === selectedValue) {
      const check = document.createElement('span');
      check.className = 'check';
      check.textContent = '✓';
      btn.appendChild(check);
    }
    btn.addEventListener('click', () => onPick(option.value));
    list.appendChild(btn);
  }
}

function openLanguageModal() {
  $('modal-language-title').textContent = L.languageTitle;
  renderChoiceList(
    'language-list',
    [
      { value: 'de', label: 'Deutsch' },
      { value: 'en', label: 'English' }
    ],
    currentLangCode(),
    async (code) => {
      settings.language = await window.api.setLanguage(code);
      L = code === 'de' ? I18N.de : I18N.en;
      refreshUi();
      $('modal-language').hidden = true;
    }
  );
  $('modal-language').hidden = false;
}

function openAutostartModal() {
  $('modal-autostart-title').textContent = L.autostartTitle;
  renderChoiceList(
    'autostart-list',
    [
      { value: 'on', label: L.autostartOn },
      { value: 'off', label: L.autostartOff }
    ],
    settings.openAtLogin ? 'on' : 'off',
    async (value) => {
      settings.openAtLogin = await window.api.setAutostart(value === 'on');
      renderMenu();
      $('modal-autostart').hidden = true;
    }
  );
  $('modal-autostart').hidden = false;
}

function openLayerModal() {
  $('modal-layer-title').textContent = L.layerTitle;
  renderChoiceList(
    'layer-list',
    [
      { value: 'top', label: L.layerTop },
      { value: 'normal', label: L.layerNormal }
    ],
    settings.alwaysOnTop ? 'top' : 'normal',
    async (value) => {
      settings.alwaysOnTop = await window.api.setPin(value === 'top');
      renderMenu();
      $('modal-layer').hidden = true;
    }
  );
  $('modal-layer').hidden = false;
}

// ---- Import / Export ----

function openDataModal() {
  $('modal-data-title').textContent = L.dataTitle;
  $('btn-import-bookmarks').textContent = L.importBookmarks;
  $('btn-import-file').textContent = L.importFile;
  $('btn-export-file').textContent = L.exportFile;
  $('btn-export-html').textContent = L.exportHtml;
  $('data-status').hidden = true;
  $('modal-data').hidden = false;
}

function showDataStatus(message) {
  const status = $('data-status');
  status.textContent = message;
  status.hidden = false;
}

let bookmarkFolders = [];
let bookmarkSelection = new Set();

async function openBookmarksModal() {
  bookmarkFolders = (await window.api.readBookmarks()) || [];
  if (!bookmarkFolders.length) {
    showDataStatus(L.noBookmarks);
    return;
  }
  bookmarkSelection = new Set();
  $('modal-data').hidden = true;
  $('modal-bookmarks-title').textContent = L.bookmarksTitle;
  $('btn-bookmarks-cancel').textContent = L.cancel;
  renderBookmarkList();
  $('modal-bookmarks').hidden = false;
}

function renderBookmarkList() {
  const list = $('bookmark-list');
  list.innerHTML = '';
  bookmarkFolders.forEach((folder, index) => {
    const row = document.createElement('label');
    row.className = 'choice-option';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = bookmarkSelection.has(index);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) bookmarkSelection.add(index);
      else bookmarkSelection.delete(index);
      updateBookmarkImportButton();
    });

    const label = document.createElement('span');
    label.className = 'option-label';
    label.textContent = folder.label ? `${folder.name} (${folder.label})` : folder.name;
    label.title = label.textContent;

    const count = document.createElement('span');
    count.className = 'bookmark-count';
    count.textContent = `${folder.sites.length} ${folder.sites.length === 1 ? L.site : L.sites}`;

    row.append(checkbox, label, count);
    list.appendChild(row);
  });
  updateBookmarkImportButton();
}

function updateBookmarkImportButton() {
  const btn = $('btn-bookmarks-import');
  btn.textContent = fmt(L.importCount, { n: bookmarkSelection.size });
  btn.disabled = bookmarkSelection.size === 0;
}

function importSelectedBookmarks() {
  for (const index of bookmarkSelection) {
    const folder = bookmarkFolders[index];
    if (!folder) continue;
    projects.push({
      id: uid(),
      name: folder.name.slice(0, 40),
      icon: '🔖',
      sites: folder.sites.map((s) => ({ id: uid(), title: s.title.slice(0, 60) || '', url: s.url }))
    });
  }
  saveProjects();
  $('modal-bookmarks').hidden = true;
  renderHome();
}

function renderMenu() {
  $('menu-language').textContent = L.language;
  $('menu-scheme').textContent = L.schemeMenu;
  $('menu-ontop').textContent = `${L.layerMenu} · ${settings.alwaysOnTop ? L.layerShortTop : L.layerShortNormal}`;
  $('menu-autostart').textContent = `${L.autostartMenu} · ${settings.openAtLogin ? L.stateOn : L.stateOff}`;
  $('menu-hide').textContent = L.hideWindow;
  $('menu-data').textContent = L.dataMenu;
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
  $('search-input').placeholder = L.searchPlaceholder;
  $('search-empty-text').textContent = L.searchEmpty;
  $('site-empty-text').textContent = L.emptySites;
  $('btn-lock').title = L.lock;
  $('btn-menu').title = L.menu;
  $('btn-back').textContent = '‹';
  $('btn-back').title = L.back;
  $('btn-edit-project').title = L.editProject;
  $('btn-delete-project').title = L.deleteProjectConfirm.split('{')[0].trim();
  $('label-project-name').textContent = L.projectName;
  $('label-project-note').textContent = L.noteLabel;
  $('label-site-note').textContent = L.noteLabel;
  $('label-project-icon').textContent = L.projectIcon;
  $('label-project-logo').textContent = L.logoLabel;
  $('btn-upload-logo').textContent = L.uploadLogo;
  $('btn-project-cancel').textContent = L.cancel;
  $('btn-project-save').textContent = L.save;
  $('label-site-name').textContent = L.siteName;
  $('label-site-url').textContent = L.siteUrl;
  $('btn-site-cancel').textContent = L.cancel;
  $('btn-site-save').textContent = L.save;
  renderMenu();
}

// ---- Init ----

async function init() {
  const state = await window.api.getState();
  projects = state.projects || [];
  logos = state.logos || [];
  settings = state.settings || settings;
  const langPref =
    settings.language || ((state.locale || '').toLowerCase().startsWith('de') ? 'de' : 'en');
  L = langPref === 'de' ? I18N.de : I18N.en;

  document.body.classList.add(
    state.platform === 'darwin' ? 'mac' : state.platform === 'win32' ? 'win' : 'linux'
  );

  applyTexts();
  applyScheme(settings.scheme || 'steel');
  $('btn-lock').classList.toggle('active', !!settings.locked);
  document.body.classList.toggle('locked', !!settings.locked);
  renderHome();

  // Header buttons
  $('btn-lock').addEventListener('click', async () => {
    settings.locked = await window.api.setLock(!settings.locked);
    $('btn-lock').classList.toggle('active', !!settings.locked);
    document.body.classList.toggle('locked', !!settings.locked);
  });
  $('btn-menu').addEventListener('click', (event) => {
    event.stopPropagation();
    $('menu').hidden = !$('menu').hidden;
  });
  document.addEventListener('click', (event) => {
    if (!$('menu').hidden && !$('menu').contains(event.target)) $('menu').hidden = true;
  });

  // Menu
  $('menu-language').addEventListener('click', () => {
    openLanguageModal();
    $('menu').hidden = true;
  });
  $('menu-ontop').addEventListener('click', () => {
    openLayerModal();
    $('menu').hidden = true;
  });
  $('menu-scheme').addEventListener('click', () => {
    renderSchemeModal();
    $('modal-scheme').hidden = false;
    $('menu').hidden = true;
  });
  $('btn-scheme-close').addEventListener('click', () => ($('modal-scheme').hidden = true));
  $('menu-autostart').addEventListener('click', () => {
    openAutostartModal();
    $('menu').hidden = true;
  });
  $('menu-github').addEventListener('click', () => {
    window.api.openExternal(GITHUB_URL);
    $('menu').hidden = true;
  });
  $('menu-data').addEventListener('click', () => {
    openDataModal();
    $('menu').hidden = true;
  });
  $('btn-import-bookmarks').addEventListener('click', openBookmarksModal);
  $('btn-export-file').addEventListener('click', async () => {
    const ok = await window.api.exportFile();
    showDataStatus(ok ? L.exportDone : L.exportFailed);
  });
  $('btn-export-html').addEventListener('click', async () => {
    const ok = await window.api.exportHtml();
    showDataStatus(ok ? L.exportDone : L.exportFailed);
  });
  $('btn-import-file').addEventListener('click', async () => {
    const result = await window.api.importFile();
    if (!result) return;
    if (result.error) {
      showDataStatus(L.importFailed);
      return;
    }
    projects = result.projects || projects;
    logos = result.logos || logos;
    showDataStatus(fmt(L.importDone, { n: result.imported }));
    if (!currentProjectId) renderHome();
  });
  $('btn-bookmarks-cancel').addEventListener('click', () => ($('modal-bookmarks').hidden = true));
  $('btn-bookmarks-import').addEventListener('click', importSelectedBookmarks);
  $('menu-hide').addEventListener('click', () => {
    $('menu').hidden = true;
    window.api.hideWindow();
  });
  $('menu-quit').addEventListener('click', () => window.api.quit());

  // Home
  $('search-input').addEventListener('input', () => renderHome());
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
  $('btn-toggle-emojis').addEventListener('click', () => {
    emojiExpanded = !emojiExpanded;
    renderEmojiGrid();
  });
  $('btn-upload-logo').addEventListener('click', async () => {
    const result = await window.api.pickLogo();
    if (result && result.picked) {
      logos = result.logos || logos;
      chosenIcon = result.picked;
      renderEmojiGrid();
      renderLogoGrid();
    }
  });
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
      for (const id of ['modal-project', 'modal-site', 'modal-scheme', 'modal-language', 'modal-layer', 'modal-autostart', 'modal-data', 'modal-bookmarks']) {
        $(id).hidden = true;
      }
      $('menu').hidden = true;
      if ($('search-input').value) {
        $('search-input').value = '';
        if (!currentProjectId) renderHome();
      }
    }
  });
  // Clicking the dark backdrop closes any modal
  document.querySelectorAll('.overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });
}

init();
