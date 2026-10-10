# LightMD Reader 📖⚡

An ultra-fast, lightweight, and gorgeous Markdown reader for the web and as a Chromium browser extension. Designed for distraction-free reading with instant rendering, smart Table of Contents, LaTeX math, and dynamic Mermaid diagrams.

---

## ✨ Features

- ⚡ **Zero-Latency Streaming Parser**: Instant rendering of large documents without lag.
- 📐 **LaTeX Mathematical Formulas (KaTeX)**: Full support for inline (`$E=mc^2$`) and block math (`$$\int e^{-x^2} dx$$`).
- 📊 **Dynamic Vector Diagrams (Mermaid)**: Real-time SVG rendering of flowcharts, sequence diagrams, and architecture graphs.
- 💻 **Syntax Highlighting**: Code syntax highlighting with 1-click **Copy** button.
- 📑 **Smart Table of Contents**: Auto-generated TOC with real-time scroll spy and search filtering.
- 🎨 **4 Curated Reading Themes**:
  - **OLED Dark**: Deep blacks for night reading.
  - **Paper Light**: Crisp, clean, high-contrast reading.
  - **Warm Sepia**: Kindle-style parchment reading.
  - **Dracula Slate**: Modern dark mauve tones.
- 🔠 **Typography Controls**: Choose between Sans-Serif (`Inter`), Serif (`Merriweather`), or Monospace (`JetBrains Mono`), adjust font size, line spacing, and page width.
- 📁 **Seamless File Loading**:
  - Drag and drop `.md` / `.txt` files directly onto the browser window.
  - Local file picker.
  - Fetch directly from raw web URLs (GitHub raw, GitLab, Gists).
- 📤 **Export Suite**:
  - Clean **Print to PDF** with tailored `@media print` styling.
  - Standalone self-contained HTML export (no external dependencies required).
  - Copy raw Markdown or rich formatted text.
- 🧘 **Zen Mode**: 1-click full-screen distraction-free reading.

---

## 🧩 Installing as a Chrome / Edge Extension

LightMD is Manifest V3 compatible. You can load it directly into Google Chrome, Microsoft Edge, Brave, or Opera:

1. Clone or download this repository:
   ```bash
   git clone https://github.com/kedarbista251-eng/.MDfile-Reader.git
   cd .MDfile-Reader
   ```
2. Install dependencies and build the extension bundle:
   ```bash
   npm install
   npm run build
   ```
3. Open your browser extension management page:
   - **Chrome**: Navigate to `chrome://extensions`
   - **Edge**: Navigate to `edge://extensions`
   - **Brave**: Navigate to `brave://extensions`
4. Enable **Developer mode** (toggle in the top-right corner).
5. Click **"Load unpacked"** and select the `dist` folder inside this repository.
6. Pin **LightMD** to your browser toolbar! Click the icon to view Markdown files in a quick popup or expand to a full tab.

---

## 💻 Running the Web App Locally

To run LightMD locally on your machine:

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Vanilla CSS with modern custom properties & design tokens
- **Markdown Compiler**: `marked` (GFM compliant)
- **Math Engine**: `katex`
- **Diagrams**: `mermaid`
- **Syntax Highlighting**: `highlight.js`
- **Sanitization**: `DOMPurify`
- **Icons**: `lucide-react`
- **Extension**: Chrome Extensions Manifest V3

---

## 📄 License

MIT License. Free and open source.
