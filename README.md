# My Desktop Order 🗂️

**Deutsch** | [English below ⬇️](#english)

**⬇️ Download-Seite: https://klennerlab.github.io/MyDesktopOrder/**

Ein kleines Projekt-Kästchen für deinen Desktop – für **macOS** und **Windows**.

Organisiere deine Webseiten in Projekten (z. B. „Poloflow“) und öffne sie mit einem Klick – alle auf einmal oder nur die, die du gerade brauchst. Nie wieder 20 offene Tabs, die du nicht schließen willst!

## Funktionen

- 🗂️ **Projekte anlegen** mit eigenem Namen, Emoji-Icon oder **eigenem Logo**
- 🔗 **Webseiten hinzufügen/bearbeiten/entfernen** pro Projekt, Reihenfolge per Ziehen
- ⌨️ **Arbeitsplatz-Starter:** Projekte können auch **Terminals** (Ordner + Startbefehl, z. B. `claude`), **Ordner** und **Dateien** enthalten – „Alle öffnen“ stellt deinen ganzen Arbeitsplatz auf
- 🔐 Projekt-Löschen erfordert das Eintippen des Projektnamens – nichts geht aus Versehen verloren
- 🚀 **Alle öffnen** oder nur **ausgewählte Seiten** öffnen – in einem **neuen Browser-Fenster**
- 🔍 **Suche** über alle Projekte und Seiten
- 🔖 **Browser-Lesezeichen importieren** (Chrome, Edge, Brave – ohne Erweiterung)
- 📤 **Export/Import als Datei** – Projekte ohne Cloud teilen
- 📝 **Notizen** pro Projekt und Seite, Duplikat-Warnung
- ⌨️ Globales Tastenkürzel **Cmd/Strg + Alt + P** zum Ein-/Ausblenden
- 📌 **Immer im Vordergrund** anpinnen (optional)
- 🖥️ Widget-Look: rahmenloses, dunkles Kästchen, frei auf dem Desktop platzierbar – die Position wird gemerkt
- 🌍 Deutsch und Englisch (im Menü ⋯ umschaltbar)
- 💾 Alles wird lokal gespeichert – keine Cloud, kein Konto, keine Datensammlung, keine Anfragen an Drittanbieter (auch die Webseiten-Symbole kommen direkt von der jeweiligen Seite und werden lokal zwischengespeichert)

## Installation

Lade die neueste Version von der [Releases-Seite](https://github.com/klennerlab/MyDesktopOrder/releases) herunter:

| System | Datei |
|---|---|
| macOS (Apple Silicon, M1–M4) | `My-Desktop-Order-…-arm64.dmg` |
| macOS (Intel) | `My-Desktop-Order-…-x64.dmg` |
| Windows | `My-Desktop-Order-Setup-….exe` |

> **Hinweis macOS:** Die App ist nicht bei Apple notariell beglaubigt (das kostet Geld). Beim ersten Start: **Rechtsklick auf die App → „Öffnen“ → „Öffnen“**. Falls macOS die App weiterhin blockiert: Systemeinstellungen → Datenschutz & Sicherheit → „Dennoch öffnen“.
>
> **Hinweis Windows:** Beim ersten Start erscheint eventuell der SmartScreen-Hinweis. Klicke auf **„Weitere Informationen“ → „Trotzdem ausführen“**.

## Aus dem Quellcode starten

```bash
git clone https://github.com/klennerlab/MyDesktopOrder.git
cd MyDesktopOrder
npm install
npm start
```

Installationspakete selbst bauen: `npm run dist`

---

<a name="english"></a>

# English

A little project box for your desktop – for **macOS** and **Windows**.

Organize your websites into projects (e.g. “Poloflow”) and open them with one click – all at once, or just the ones you need right now. No more 20 open tabs you don’t dare to close!

## Features

- 🗂️ **Create projects** with a custom name, emoji icon or **your own logo**
- 🔗 **Add/edit/remove websites** per project, reorder via drag & drop
- ⌨️ **Workspace launcher:** projects can also contain **terminals** (folder + start command, e.g. `claude`), **folders** and **files** – “Open all” sets up your whole workspace
- 🔐 Deleting a project requires typing its name – nothing gets lost by accident
- 🚀 **Open all** sites or only **selected ones** – in a **new browser window**
- 🔍 **Search** across all projects and sites
- 🔖 **Import browser bookmarks** (Chrome, Edge, Brave – no extension needed)
- 📤 **Export/import as a file** – share projects without any cloud
- 📝 **Notes** per project and site, duplicate warning
- ⌨️ Global shortcut **Cmd/Ctrl + Alt + P** to show/hide
- 📌 Optional **always-on-top** pinning
- 🖥️ Widget look: frameless dark box, place it anywhere on your desktop – position is remembered
- 🌍 German and English (switchable in the ⋯ menu)
- 💾 Everything is stored locally – no cloud, no account, no data collection, no third-party requests (site icons are loaded directly from each site and cached locally)

## Installation

Download the latest version from the [Releases page](https://github.com/klennerlab/MyDesktopOrder/releases):

| System | File |
|---|---|
| macOS (Apple Silicon, M1–M4) | `My-Desktop-Order-…-arm64.dmg` |
| macOS (Intel) | `My-Desktop-Order-…-x64.dmg` |
| Windows | `My-Desktop-Order-Setup-….exe` |

> **macOS note:** The app is not notarized by Apple (that costs money). On first launch: **right-click the app → “Open” → “Open”**. If macOS still blocks it: System Settings → Privacy & Security → “Open Anyway”.
>
> **Windows note:** SmartScreen may warn on first launch. Click **“More info” → “Run anyway”**.

## Run from source

```bash
git clone https://github.com/klennerlab/MyDesktopOrder.git
cd MyDesktopOrder
npm install
npm start
```

Build installers yourself: `npm run dist`

## License

[MIT](LICENSE) – free for everyone. 💙
