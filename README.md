# Wplace Color Downloader

Wplace Color Downloader lets you upload an image and extract colors that match a fixed 64-color palette (32 free + 32 paid). The app shows which palette colors are used in the image and lets you select and download previews for chosen colors.

Live demo: https://wplace-colors-downloader.perd.workers.dev/

How to use
- Open the app in your browser.
- Upload an image (PNG/JPG). The app analyzes the image pixels and highlights used palette colors.
- If the image contains colors outside the palette you will see an error.
- Select colors from the Free or Paid lists and click "Download Selected Colors" to save previews.

Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

Build for production

```bash
npm run build
npm run preview
```

Testing (Playwright)
- Run tests: `npm run test:playwright`
- CI run (starts dev server): `npm run test:playwright:ci`
- Update visual snapshots: `npm run test:playwright:update`

Notes
- Playwright snapshots and temporary test results are ignored by `.gitignore`. Regenerate snapshots locally with the update command if you change the UI.
- The floating preview panel is fixed to the top-right on both desktop and mobile.

Files you’ll care about
- `src/App.vue` — main logic (canvas processing, color counting, selection)
- `src/components/PreviewPanel.vue` — floating preview UI
- `src/components/FileUpload.vue`, `PaletteGrid.vue`, `ColorList.vue` — UI pieces

If you want a short user guide or screenshots added here, tell me and I’ll include them.
