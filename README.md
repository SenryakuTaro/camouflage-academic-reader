# 📄 Camouflage Academic Reader

> A Chrome extension that transforms any Japanese webpage into a convincing academic paper or newspaper layout — complete with romanized text.

> 日本語のWebページを学術論文・英字新聞スタイルに変換するChrome拡張機能。日本語テキストをローマ字に自動変換します。

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)
![License](https://img.shields.io/badge/license-MIT-orange)

---

## What it does / 概要

Camouflage Academic Reader rewrites the visual layout of any webpage into a two-column academic journal or three-column newspaper format.
Japanese text is automatically romanized using morphological analysis (kuromoji), so the content appears as scholarly English-style prose.
Hover over any paragraph to reveal the original Japanese source text in a tooltip.

日本語WebページのレイアウトをまるごとAcademic Paper（学術論文）またはNewspaper（英字新聞）スタイルに書き換えます。
日本語テキストはkuromojiによる形態素解析でローマ字に自動変換されます。
テキストにホバーすると元の日本語が表示されます。

---

## Features / 機能

| Feature | 機能 |
|---|---|
| **Academic Paper layout** | 学術論文スタイル（2カラム・Times New Roman） |
| **Newspaper layout** | 英字新聞スタイル（3カラム・マストヘッド形式） |
| **Japanese → Romaji** | ひらがな・カタカナ・漢字をすべてローマ字に変換 |
| **Original text tooltip** | ホバーで元の日本語テキストを表示 |
| **Boss Key** | `Esc` × 2 で即座にオーバーレイを非表示 |
| **Keyboard shortcut** | `Ctrl`+`Shift`+`L`（Mac: `⌘`+`Shift`+`L`）でトグル |
| **SPA support** | Twitter/X・ニュースサイトのページ遷移に追従 |
| **Persistent settings** | レイアウト・ツールチップ設定を保存 |

---

## Installation / インストール方法

> The extension is not on the Chrome Web Store. Install it manually in a few steps.
> Chrome Web Storeには未掲載のため、手動でインストールしてください。

### Step 1 — Download / ダウンロード

Click **Code → Download ZIP** on this page, then extract the ZIP anywhere on your computer.

このページの **Code → Download ZIP** をクリックし、ZIPを解凍します。

### Step 2 — Open Chrome Extensions / Chrome拡張機能ページを開く

```
chrome://extensions/
```

### Step 3 — Enable Developer Mode / デベロッパーモードをON

Toggle **Developer mode** on (top-right corner).

右上の **「デベロッパーモード」** をONにします。

### Step 4 — Load the extension / フォルダを読み込む

Click **"Load unpacked"** and select the extracted folder.

**「パッケージ化されていない拡張機能を読み込む」** をクリックし、解凍したフォルダ（`camouflage-academic-reader-main`）を選択します。

Chromeのツールバーに拡張機能アイコンが表示されれば完了です。

---

## Usage / 使い方

1. Navigate to any Japanese webpage (NHK, Yahoo News, Twitter/X, etc.)
2. Click the extension icon **or** press `Ctrl`+`Shift`+`L`
3. The page transforms into an academic paper layout
4. Hover any text block to see the original Japanese
5. Press `Esc` twice to immediately hide (Boss Key)

---

1. 日本語のWebページ（NHKニュース・Yahoo！ニュース・X/Twitterなど）を開く
2. ツールバーのアイコンをクリック、または `Ctrl`+`Shift`+`L` を押す
3. ページが学術論文スタイルに変換される
4. テキストにホバーすると元の日本語が確認できる
5. `Esc` を素早く2回押すと即座に元のページに戻る（ボスキー）

### Popup options / ポップアップ設定

- **Layout** — Academic Paper（2カラム）と Newspaper（3カラム）を切り替え
- **Original text on hover** — ホバー時の日本語テキスト表示をON/OFF

---

## How the romanization works / ローマ字変換について

Japanese morphological analysis is performed by [kuromoji](https://github.com/takuyaa/kuromoji), a pure-JavaScript tokenizer.

日本語の形態素解析には [kuromoji](https://github.com/takuyaa/kuromoji)（純JavaScript実装）を使用しています。

| Input | Output |
|---|---|
| Hiragana / ひらがな（あいう） | a i u |
| Katakana / カタカナ（アイウ） | a i u |
| Kanji / 漢字（東京） | toukyou |
| Mixed / 混在（日本語） | nihon go |
| Already-Roman / 英字 | left as-is |

A custom lookup table of ~440 common kanji supplements the morphological analysis.

独自に構築した約440語の漢字読みテーブルで形態素解析を補完しています。

---

## Tech stack / 技術構成

- **Chrome Extensions Manifest V3**
- **[kuromoji.js](https://github.com/takuyaa/kuromoji)** — Japanese morphological analyzer / 日本語形態素解析
- Vanilla JS (no build step) / バニラJS（ビルド不要）
- CSS custom overlay / CSSオーバーレイ

---

## License

MIT License — free to use, modify, and distribute.

---

## Author

**SenryakuTaro** — [ST.Lab](https://senryakutaro-portal.vercel.app)
