# 📄 Camouflage Academic Reader

> A Chrome extension that transforms any Japanese webpage into a convincing academic paper or newspaper layout — complete with romanized text.

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)
![License](https://img.shields.io/badge/license-MIT-orange)

---

## What it does

Camouflage Academic Reader rewrites the visual layout of any webpage into a two-column academic journal or three-column newspaper format.
Japanese text is automatically romanized using morphological analysis (kuromoji), so the content appears as scholarly English-style prose.

Hover over any paragraph to reveal the original Japanese source text in a tooltip.

---

## Features

| Feature | Detail |
|---|---|
| **Academic Paper layout** | 2-column Times New Roman, fictional journal header |
| **Newspaper layout** | 3-column masthead style, fictional newspaper name |
| **Japanese → Romaji** | Full morphological analysis via kuromoji — hiragana, katakana, kanji all converted |
| **Original text tooltip** | Hover any paragraph to see the Japanese source |
| **Boss Key** | Press `Esc` twice to instantly remove the overlay |
| **Keyboard shortcut** | `Ctrl`+`Shift`+`L` (Mac: `⌘`+`Shift`+`L`) to toggle |
| **SPA support** | Follows client-side navigation (Twitter/X, news sites) |
| **Persistent settings** | Layout style and tooltip preference saved across sessions |

---

## Installation (Developer Mode)

> The extension is not on the Chrome Web Store. Install it manually in a few steps.

### Step 1 — Download

Click **Code → Download ZIP** on this page, then extract the ZIP anywhere on your computer.

```
PaperReader/
├── manifest.json
├── content.js
├── academic.css
├── popup.html / popup.js
├── background.js
├── lib/
│   ├── kuromoji.js
│   └── dict/        ← dictionary files required
└── icons/
```

### Step 2 — Open Chrome Extensions

Open Chrome and go to:

```
chrome://extensions/
```

### Step 3 — Enable Developer Mode

Toggle **Developer mode** on (top-right corner of the extensions page).

### Step 4 — Load the extension

Click **"Load unpacked"** and select the `PaperReader` folder you extracted in Step 1.

The extension icon will appear in your Chrome toolbar.

---

## Usage

1. Navigate to any Japanese webpage (news, Twitter/X, blogs, etc.)
2. Click the extension icon **or** press `Ctrl`+`Shift`+`L`
3. The page transforms into an academic paper layout
4. Hover any text block to see the original Japanese
5. Press `Esc` twice to immediately hide (Boss Key)
6. Click the icon again or press the shortcut to return to the original page

### Popup options

- **Layout** — switch between *Academic Paper* (2-col) and *Newspaper* (3-col)
- **Original text on hover** — enable/disable the Japanese tooltip

---

## How the romanization works

Japanese morphological analysis is performed by [kuromoji](https://github.com/takuyaa/kuromoji), a pure-JavaScript tokenizer.

Each token is converted:

| Input | Output example |
|---|---|
| Hiragana (あいう) | a i u |
| Katakana (アイウ) | a i u |
| Kanji (東京) | toukyou |
| Mixed (日本語) | nihon go |
| Already-Roman | left as-is |

A custom lookup table of ~440 common kanji provides readings for tokens where the morphological reading is unavailable.

---

## File structure

```
PaperReader/
├── manifest.json          Chrome extension manifest (MV3)
├── content.js             Main logic: extraction, romanization, overlay
├── academic.css           Overlay styles (academic + newspaper themes)
├── popup.html             Extension popup UI
├── popup.js               Popup interaction logic
├── background.js          Service worker (keyboard shortcut handler)
├── lib/
│   ├── kuromoji.js        Bundled kuromoji tokenizer (UMD)
│   └── dict/              Binary dictionary files (kuromoji)
│       ├── base.dat.gz
│       ├── check.dat.gz
│       └── ...
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## Tech stack

- **Chrome Extensions Manifest V3**
- **[kuromoji.js](https://github.com/takuyaa/kuromoji)** — Japanese morphological analyzer
- Vanilla JS (no build step required)
- CSS custom overlay (no framework)

---

## Notes

- Works on most Japanese news sites (NHK, Yahoo News, Nikkei, etc.)
- Works on Twitter/X Japanese timelines
- Content script is injected on-demand; the extension does not run in the background on every page
- The dictionary files (`lib/dict/`) are required and must be present in the loaded folder

---

## License

MIT License — free to use, modify, and distribute.

---

## Author

Built as a personal project / portfolio piece demonstrating:
- Chrome Extension development (MV3)
- Japanese NLP with kuromoji
- DOM manipulation and content extraction
- CSS overlay architecture
