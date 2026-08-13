# Project Launcher 🚀

**Deutsch** | [English below ⬇️](#english)

**⬇️ Download-Seite: https://klennerlab.github.io/project-launcher/**

Öffne alles, was du für ein Projekt brauchst, mit einem Klick. **Webseiten · Terminals · Ordner · Dateien** – für **macOS**, **Windows** und **Linux**.

Organisiere deine Projekte (z. B. „Poloflow“) als kleine Kästchen auf dem Desktop und starte deinen ganzen Arbeitsplatz mit einem Klick – alle Webseiten, Terminals, Ordner und Dateien auf einmal oder nur die, die du gerade brauchst.

*(Früher bekannt als „My Desktop Order“ – bestehende Daten werden beim Update automatisch übernommen.)*

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

Lade die neueste Version von der [Releases-Seite](https://github.com/klennerlab/project-launcher/releases) herunter:

| System | Datei |
|---|---|
| macOS (Apple Silicon, M1–M4) | `project-launcher-mac-arm64.dmg` |
| macOS (Intel) | `project-launcher-mac-x64.dmg` |
| Windows | `project-launcher-setup-windows.exe` |
| Linux | `project-launcher-linux-x64.AppImage` |

> **Hinweis macOS:** Die App ist signiert und von Apple notariell beglaubigt (seit v2.0.1). Beim ersten Start fragt macOS nur kurz, ob du die aus dem Internet geladene App öffnen möchtest – auf „Öffnen“ klicken, fertig.
>
> **Hinweis Windows:** Beim ersten Start erscheint eventuell der SmartScreen-Hinweis. Klicke auf **„Weitere Informationen“ → „Trotzdem ausführen“**.
>
> **Hinweis Linux:** Die AppImage-Datei einmal ausführbar machen (Rechtsklick → Eigenschaften → „Als Programm ausführen“ aktivieren, oder `chmod +x` im Terminal), dann per Doppelklick starten.

## Aus dem Quellcode starten

```bash
git clone https://github.com/klennerlab/project-launcher.git
cd project-launcher
npm install
npm start
```

Installationspakete selbst bauen: `npm run dist`

---

<a name="english"></a>

# English

Open everything you need for a project in one click. **Websites · Terminals · Folders · Files** – for **macOS**, **Windows** and **Linux**.

Organize your projects (e.g. “Poloflow”) as little boxes on your desktop and launch your whole workspace with one click – all websites, terminals, folders and files at once, or just the ones you need right now.

*(Formerly known as “My Desktop Order” – existing data is adopted automatically when you update.)*

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

Download the latest version from the [Releases page](https://github.com/klennerlab/project-launcher/releases):

| System | File |
|---|---|
| macOS (Apple Silicon, M1–M4) | `project-launcher-mac-arm64.dmg` |
| macOS (Intel) | `project-launcher-mac-x64.dmg` |
| Windows | `project-launcher-setup-windows.exe` |
| Linux | `project-launcher-linux-x64.AppImage` |

> **macOS note:** The app is signed and notarized by Apple (since v2.0.1). On first launch macOS just briefly asks if you want to open an app downloaded from the internet – click “Open” and you are done.
>
> **Windows note:** SmartScreen may warn on first launch. Click **“More info” → “Run anyway”**.
>
> **Linux note:** Make the AppImage file executable once (right-click → Properties → enable “Run as a program”, or `chmod +x` in a terminal), then start it with a double-click.

## Run from source

```bash
git clone https://github.com/klennerlab/project-launcher.git
cd project-launcher
npm install
npm start
```

Build installers yourself: `npm run dist`

## License

[MIT](LICENSE) – free for everyone. 💙
