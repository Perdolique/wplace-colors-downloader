<template>
  <div class="app">
  <h1 class="title">Image Upload & Palette Checker</h1>
  <FileUpload @fileChange="onFileChange" />
    <canvas ref="canvasRef" class="canvas" v-show="imageLoaded && !error"></canvas>
    <div v-if="error" class="error">{{ error }}</div>
  <div v-if="imageLoaded && !error" class="success">Image loaded successfully. Colors used: {{ usedColors.length }}</div>

    <div class="palette">
      <h2 class="palette-title">Free Colors (32)</h2>
      <PaletteGrid :colors="freeColors" :names="freeColorNames" :usedSet="usedColorSet" />

      <h2 class="palette-title">Paid Colors (32)</h2>
      <PaletteGrid :colors="paidColors" :names="paidColorNames" :usedSet="usedColorSet" />
    </div>

    <div v-if="imageLoaded && !error" class="color-list">
      <ColorList
        title="Free Colors Used (sorted by pixel count)"
        :items="freeUsed"
        :names="colorToName"
        :selected="selectedColors"
        :showSelectAll="true"
        selectLabel="Select all free"
        @toggle="toggleColor"
        @select-all="selectAllFree"
        @download-group="downloadFreeColors"
      />

      <ColorList
        title="Paid Colors Used (sorted by pixel count)"
        :items="paidUsed"
        :names="colorToName"
        :selected="selectedColors"
        :showSelectAll="true"
        selectLabel="Select all paid"
        @toggle="toggleColor"
        @select-all="selectAllPaid"
        @download-group="downloadPaidColors"
      />

      <div class="actions">
        <PreviewPanel
          :previewOpen="previewOpen"
          :previewDataUrl="previewDataUrl"
          :disabled="selectedColors.size === 0"
          :imageLoaded="imageLoaded"
          :placeholderFilename="placeholderFilename"
          @toggle="togglePreview"
          @open="previewOpen = true"
          @download="downloadSelectedColors"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import FileUpload from './components/FileUpload.vue'
import PaletteGrid from './components/PaletteGrid.vue'
import ColorList from './components/ColorList.vue'
import PreviewPanel from './components/PreviewPanel.vue'
// import default example image from src/assets (moved from public)
import exampleImage from './assets/coolstory-bob.png'


const canvasRef = ref<HTMLCanvasElement>()
const error = ref('')
const imageLoaded = ref(false)
const usedColors = ref<[string, number][]>([])
const usedColorSet = ref(new Set<string>())
const freeUsed = ref<[string, number][]>([])
const paidUsed = ref<[string, number][]>([])
const originalFileName = ref('')
const selectedColors = ref(new Set<string>())

const freeColors = [
  'transparent',
  'rgb(0,0,0)',
  'rgb(60,60,60)',
  'rgb(120,120,120)',
  'rgb(210,210,210)',
  'rgb(255,255,255)',
  'rgb(96,0,24)',
  'rgb(237,28,36)',
  'rgb(255,127,39)',
  'rgb(246,170,9)',
  'rgb(249,221,59)',
  'rgb(255,250,188)',
  'rgb(14,185,104)',
  'rgb(19,230,123)',
  'rgb(135,255,94)',
  'rgb(12,129,110)',
  'rgb(16,174,166)',
  'rgb(19,225,190)',
  'rgb(40,80,158)',
  'rgb(64,147,228)',
  'rgb(96,247,242)',
  'rgb(107,80,246)',
  'rgb(153,177,251)',
  'rgb(120,12,153)',
  'rgb(170,56,185)',
  'rgb(224,159,249)',
  'rgb(203,0,122)',
  'rgb(236,31,128)',
  'rgb(243,141,169)',
  'rgb(104,70,52)',
  'rgb(149,104,42)',
  'rgb(248,178,119)'
]

const paidColors = [
  'rgb(170,170,170)',
  'rgb(165,14,30)',
  'rgb(250,128,114)',
  'rgb(228,92,26)',
  'rgb(214,181,148)',
  'rgb(156,132,49)',
  'rgb(197,173,49)',
  'rgb(232,212,95)',
  'rgb(74,107,58)',
  'rgb(90,148,74)',
  'rgb(132,197,115)',
  'rgb(15,121,159)',
  'rgb(187,250,242)',
  'rgb(125,199,255)',
  'rgb(77,49,184)',
  'rgb(74,66,132)',
  'rgb(122,113,196)',
  'rgb(181,174,241)',
  'rgb(219,164,99)',
  'rgb(209,128,81)',
  'rgb(255,197,165)',
  'rgb(155,82,73)',
  'rgb(209,128,120)',
  'rgb(250,182,164)',
  'rgb(123,99,82)',
  'rgb(156,132,107)',
  'rgb(51,57,65)',
  'rgb(109,117,141)',
  'rgb(179,185,209)',
  'rgb(109,100,63)',
  'rgb(148,140,107)',
  'rgb(205,197,158)'
]

const freeColorNames = [
  'Transparent',
  'Black',
  'Dark Gray',
  'Gray',
  'Light Gray',
  'White',
  'Deep Red',
  'Red',
  'Orange',
  'Gold',
  'Yellow',
  'Light Yellow',
  'Dark Green',
  'Green',
  'Light Green',
  'Dark Teal',
  'Teal',
  'Light Teal',
  'Cyan',
  'Dark Blue',
  'Blue',
  'Indigo',
  'Light Indigo',
  'Dark Purple',
  'Purple',
  'Light Purple',
  'Dark Pink',
  'Pink',
  'Light Pink',
  'Dark Brown',
  'Brown',
  'Beige'
]

const paidColorNames = [
  'Medium Gray',
  'Dark Red',
  'Light Red',
  'Dark Orange',
  'Light Tan',
  'Dark Goldenrod',
  'Goldenrod',
  'Light Goldenrod',
  'Dark Olive',
  'Olive',
  'Light Olive',
  'Dark Cyan',
  'Light Cyan',
  'Light Blue',
  'Dark Indigo',
  'Dark Slate Blue',
  'Slate Blue',
  'Light Slate Blue',
  'Light Brown',
  'Dark Beige',
  'Light Beige',
  'Dark Peach',
  'Peach',
  'Light Peach',
  'Dark Tan',
  'Tan',
  'Dark Slate',
  'Slate',
  'Light Slate',
  'Dark Stone',
  'Stone',
  'Light Stone'
]

const colorToName = new Map()
freeColors.forEach((color, i) => colorToName.set(color, freeColorNames[i]))
paidColors.forEach((color, i) => colorToName.set(color, paidColorNames[i]))

const allColors = new Set([...freeColors, ...paidColors])

const previewDataUrl = ref('')
const previewOpen = ref(true)

const placeholderFilename = computed(() => {
  if (originalFileName.value) return originalFileName.value
  try {
    if (typeof exampleImage === 'string') return exampleImage.split('/').pop() || 'example image'
  } catch {
    // ignore
  }
  return 'example image'
})

// restore preview open/closed state from localStorage (safe in browsers)
try {
  const stored = localStorage.getItem('previewOpen')
  if (stored !== null) previewOpen.value = stored === 'true'
} catch {
  // ignore if localStorage not available
}

// persist state when it changes
watch(previewOpen, (val) => {
  try {
    localStorage.setItem('previewOpen', String(val))
  } catch {
    // ignore storage errors
  }
})

function togglePreview() {
  previewOpen.value = !previewOpen.value
}

// ensure any UI animation starts after mount to avoid initial jump
onMounted(() => {
  // small tick to allow layout then transitions will animate
  requestAnimationFrame(() => {
    /* no-op: this keeps us ready for future animation tweaks */
  })
})

const onFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const fileName = file.name
  if (fileName) {
    const baseName = fileName.split('.')[0] || ''
    originalFileName.value = baseName.replace(/[^a-zA-Z0-9]/g, '_')
  }
  error.value = ''
  imageLoaded.value = false
  usedColors.value = []
  usedColorSet.value = new Set()
  freeUsed.value = []
  paidUsed.value = []
  // reset any selected colors when a new file is chosen
  selectedColors.value = new Set()

  const img = new Image()
  img.onload = () => {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const colorCounts = new Map<string, number>()
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i]
      const g = imageData.data[i + 1]
      const b = imageData.data[i + 2]
      const a = imageData.data[i + 3]!
      const color = a < 255 ? 'transparent' : `rgb(${r},${g},${b})`
      colorCounts.set(color, (colorCounts.get(color) || 0) + 1)
    }

    const colors = new Set(colorCounts.keys())
    const invalidColors = Array.from(colors).filter(c => !allColors.has(c))
    if (invalidColors.length > 0) {
      error.value = `Error: ${invalidColors.length} colors not in palette, ${colors.size - invalidColors.length} colors match.`
      return
    }

    usedColors.value = Array.from(colorCounts.entries()).sort((a, b) => b[1] - a[1])
    usedColorSet.value = new Set(usedColors.value.map(([c]) => c))
    freeUsed.value = usedColors.value.filter(([c]) => freeColors.includes(c))
    paidUsed.value = usedColors.value.filter(([c]) => paidColors.includes(c))
    imageLoaded.value = true
    // reset preview when a new image is loaded
    previewDataUrl.value = ''
    // reset any selected colors when a new file is loaded
    selectedColors.value = new Set()
  }
  img.src = URL.createObjectURL(file)
}

// try to load a default example image from src/assets on mount
try {
  const defaultUrl = exampleImage as string
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    // reuse the same processing logic as file input
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const colorCounts = new Map<string, number>()
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i]
      const g = imageData.data[i + 1]
      const b = imageData.data[i + 2]
      const a = imageData.data[i + 3]!
      const color = a < 255 ? 'transparent' : `rgb(${r},${g},${b})`
      colorCounts.set(color, (colorCounts.get(color) || 0) + 1)
    }

    const colors = new Set(colorCounts.keys())
    const invalidColors = Array.from(colors).filter(c => !allColors.has(c))
    if (invalidColors.length === 0) {
      usedColors.value = Array.from(colorCounts.entries()).sort((a, b) => b[1] - a[1])
      usedColorSet.value = new Set(usedColors.value.map(([c]) => c))
      freeUsed.value = usedColors.value.filter(([c]) => freeColors.includes(c))
      paidUsed.value = usedColors.value.filter(([c]) => paidColors.includes(c))
      imageLoaded.value = true
      previewDataUrl.value = ''
    }
  }
  // set src last to trigger load
  img.src = defaultUrl
} catch (e) {
  // if default image is missing or fails, warn but do not block app
  // eslint-disable-next-line no-console
  console.warn('Default example image not loaded', e)
}

const downloadFreeColors = () => {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const newImageData = new ImageData(canvas.width, canvas.height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i]!
    const g = imageData.data[i + 1]!
    const b = imageData.data[i + 2]!
    const a = imageData.data[i + 3]!
    const pixelColor = a < 255 ? 'transparent' : `rgb(${r},${g},${b})`
    if (freeColors.includes(pixelColor)) {
      newImageData.data[i] = r
      newImageData.data[i + 1] = g
      newImageData.data[i + 2] = b
      newImageData.data[i + 3] = a
    } else {
      newImageData.data[i] = 0
      newImageData.data[i + 1] = 0
      newImageData.data[i + 2] = 0
      newImageData.data[i + 3] = 0
    }
  }
  const newCanvas = document.createElement('canvas')
  newCanvas.width = canvas.width
  newCanvas.height = canvas.height
  const newCtx = newCanvas.getContext('2d')!
  newCtx.putImageData(newImageData, 0, 0)
  const link = document.createElement('a')
  link.download = `${originalFileName.value}_free_colors.png`
  link.href = newCanvas.toDataURL()
  // update preview to the free-only image
  previewDataUrl.value = newCanvas.toDataURL()
  link.click()
}

const downloadPaidColors = () => {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const newImageData = new ImageData(canvas.width, canvas.height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i]!
    const g = imageData.data[i + 1]!
    const b = imageData.data[i + 2]!
    const a = imageData.data[i + 3]!
    const pixelColor = a < 255 ? 'transparent' : `rgb(${r},${g},${b})`
    if (paidColors.includes(pixelColor)) {
      newImageData.data[i] = r
      newImageData.data[i + 1] = g
      newImageData.data[i + 2] = b
      newImageData.data[i + 3] = a
    } else {
      newImageData.data[i] = 0
      newImageData.data[i + 1] = 0
      newImageData.data[i + 2] = 0
      newImageData.data[i + 3] = 0
    }
  }
  const newCanvas = document.createElement('canvas')
  newCanvas.width = canvas.width
  newCanvas.height = canvas.height
  const newCtx = newCanvas.getContext('2d')!
  newCtx.putImageData(newImageData, 0, 0)
  const link = document.createElement('a')
  link.download = `${originalFileName.value}_paid_colors.png`
  link.href = newCanvas.toDataURL()
  // update preview to the paid-only image
  previewDataUrl.value = newCanvas.toDataURL()
  link.click()
}

const toggleColor = (color: string) => {
  if (selectedColors.value.has(color)) {
    selectedColors.value.delete(color)
  } else {
    selectedColors.value.add(color)
  }
  // update preview when selection changes
  generatePreview()
}

const downloadSelectedColors = () => {
  if (selectedColors.value.size === 0) return
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const newImageData = new ImageData(canvas.width, canvas.height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i]!
    const g = imageData.data[i + 1]!
    const b = imageData.data[i + 2]!
    const a = imageData.data[i + 3]!
    const pixelColor = a < 255 ? 'transparent' : `rgb(${r},${g},${b})`
    if (selectedColors.value.has(pixelColor)) {
      newImageData.data[i] = r
      newImageData.data[i + 1] = g
      newImageData.data[i + 2] = b
      newImageData.data[i + 3] = a
    } else {
      newImageData.data[i] = 0
      newImageData.data[i + 1] = 0
      newImageData.data[i + 2] = 0
      newImageData.data[i + 3] = 0
    }
  }
  const newCanvas = document.createElement('canvas')
  newCanvas.width = canvas.width
  newCanvas.height = canvas.height
  const newCtx = newCanvas.getContext('2d')!
  newCtx.putImageData(newImageData, 0, 0)
  const link = document.createElement('a')
  // choose a base filename: prefer originalFileName, then placeholderFilename, then a generic name
  let baseName = originalFileName.value || ''
  try {
    // placeholderFilename is a computed ref; use its value if original not set
    // (placeholderFilename may not be defined in some contexts, guard access)
    // @ts-ignore
    if (!baseName && typeof placeholderFilename !== 'undefined') baseName = placeholderFilename.value || ''
  } catch {
    // ignore
  }
  if (!baseName) baseName = 'selected_colors'
  // strip extension if present
  baseName = baseName.replace(/\.[^/.]+$/, '')
  link.download = `${baseName}_selected_colors.png`
  link.href = newCanvas.toDataURL()
  previewDataUrl.value = newCanvas.toDataURL()
  link.click()
}

const selectAllFree = () => {
  const group = freeUsed.value.map(([c]) => c)
  if (group.length === 0) return
  const sel = selectedColors.value
  const allSelected = group.every(c => sel.has(c))
  if (allSelected) {
    group.forEach(c => sel.delete(c))
  } else {
    group.forEach(c => sel.add(c))
  }
  generatePreview()
}

const selectAllPaid = () => {
  const group = paidUsed.value.map(([c]) => c)
  if (group.length === 0) return
  const sel = selectedColors.value
  const allSelected = group.every(c => sel.has(c))
  if (allSelected) {
    group.forEach(c => sel.delete(c))
  } else {
    group.forEach(c => sel.add(c))
  }
  generatePreview()
}

function generatePreview() {
  const canvas = canvasRef.value!
  if (!canvas || !imageLoaded.value) return
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const newImageData = new ImageData(canvas.width, canvas.height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i]!
    const g = imageData.data[i + 1]!
    const b = imageData.data[i + 2]!
    const a = imageData.data[i + 3]!
    const pixelColor = a < 255 ? 'transparent' : `rgb(${r},${g},${b})`
    if (selectedColors.value.size > 0 && selectedColors.value.has(pixelColor)) {
      newImageData.data[i] = r
      newImageData.data[i + 1] = g
      newImageData.data[i + 2] = b
      newImageData.data[i + 3] = a
    } else {
      // either nothing selected or pixel not selected -> transparent
      newImageData.data[i] = 0
      newImageData.data[i + 1] = 0
      newImageData.data[i + 2] = 0
      newImageData.data[i + 3] = 0
    }
  }
  const newCanvas = document.createElement('canvas')
  newCanvas.width = canvas.width
  newCanvas.height = canvas.height
  const newCtx = newCanvas.getContext('2d')!
  newCtx.putImageData(newImageData, 0, 0)
  // produce a scaled preview data URL to keep payload small
  const previewCanvas = document.createElement('canvas')
  const maxPreviewSize = 800
  const scale = Math.min(1, maxPreviewSize / Math.max(newCanvas.width, newCanvas.height))
  previewCanvas.width = Math.round(newCanvas.width * scale)
  previewCanvas.height = Math.round(newCanvas.height * scale)
  const pctx = previewCanvas.getContext('2d')!
  pctx.drawImage(newCanvas, 0, 0, previewCanvas.width, previewCanvas.height)
  previewDataUrl.value = previewCanvas.toDataURL()
}
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.file-input {
  margin-bottom: 20px;
}

.canvas {
  max-width: 100%;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.error {
  color: red;
  font-weight: bold;
  margin-bottom: 20px;
}

.success {
  color: green;
  margin-bottom: 20px;
}

.palette {
  margin-top: 20px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.palette-grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(56px, 1fr));
  gap: 10px;
}

.palette-color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.color-box {
  width: 40px;
  height: 40px;
  border: 1px solid #000;
  position: relative;
  opacity: 0.5;
  margin-bottom: 5px;
}

.color-name {
  font-size: 10px;
  text-align: center;
  word-wrap: break-word;
  max-width: 40px;
  line-height: 1.2;
}

.color-box.used {
  opacity: 1;
}

.color-box.used::after {
  content: '✓';
  position: absolute;
  top: 0;
  right: 0;
  color: green;
  font-size: 12px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.8);
  padding: 0 2px;
}

.color-list {
  margin-top: 20px;
}

.color-list h3 {
  margin-bottom: 10px;
}

.color-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;
}

.color-item .color-box {
  width: 30px;
  height: 30px;
  border: 1px solid #000;
  margin-right: 10px;
}

.color-item span {
  font-size: 16px;
}

.color-item.selected {
  border: 2px solid blue;
  background-color: rgba(0, 0, 255, 0.1);
}

.transparent-pattern {
  background: repeating-conic-gradient(#808080 0% 25%, #c0c0c0 25% 50%) 50% / 8px 8px;
  width: 100%;
  height: 100%;
}

.download-link {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 10px;
}

.actions { display:flex; gap:20px; align-items:flex-start; margin-top:12px }
.preview-download-wrap { margin-top: 10px; display:flex; width:100% }
.preview-download-big { width:100%; padding:10px 12px; border-radius:8px; background: #2563eb; color:#fff; border:none; cursor:pointer; font-weight:600 }
.preview-download-big:hover { background: #2563eb }
.preview-download-big:disabled { background:#94a3b8; cursor:not-allowed }
.preview {
  max-width: 480px;
  position: fixed;
  top: 80px;
  right: 24px;
  width: 320px;
  z-index: 60;
  background: #fff;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 6px 20px rgba(2,6,23,0.08);
  /* animate size and opacity smoothly */
  transition: width 240ms ease, height 240ms ease, padding 200ms ease, opacity 200ms ease, transform 180ms ease;
  will-change: width, height, transform, opacity;
  cursor: pointer;
}
.preview.collapsed {
  width: 72px;
  height: 72px;
  padding: 6px;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.98);
  opacity: 0.98;
  cursor: pointer;
  border: 1px solid rgba(2,6,23,0.04);
}
.preview.collapsed .preview-header h4 { display: none }
.preview.collapsed .preview-header { padding: 0; border-radius: 6px; width: 100%; height: 100%; align-items: center; justify-content: center }
.preview.collapsed .preview-toggle { display:flex; align-items:center; justify-content:center; width:100%; height:100%; font-size: 20px; padding: 0; border-radius: 6px }
.preview-hit { position: absolute; inset: 0; background: transparent; border: none; cursor: pointer; border-radius: 8px; transition: background 180ms ease }
.preview-hit:focus { outline: 2px solid rgba(59,130,246,0.6); border-radius: 6px }
.preview-toggle { background: transparent; border: none; cursor: pointer; font-size: 16px; padding: 4px 8px; border-radius: 6px }
.preview-img { width: 100%; height: auto; border: 1px solid #ddd; border-radius:8px; cursor: pointer }
.preview-empty { color: #666; font-size: 14px }

/* make the whole header a clickable button */
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  background: transparent; /* let container background show through for consistency */
  padding: 6px 10px;
  height: 48px;
  border-radius: 6px;
  border: none; /* avoid double border with .preview container */
  cursor: pointer;
  transition: background 160ms ease, box-shadow 160ms ease, transform 120ms ease;
}
.preview-header:focus {
  outline: 3px solid rgba(59,130,246,0.14);
  box-shadow: 0 6px 20px rgba(2,6,23,0.06);
}
.preview-header:hover { background: rgba(2,6,23,0.02) }
.preview-title { margin: 0; font-size: 14px; font-weight: 600 }
.preview-header .preview-toggle { font-size: 18px; padding: 2px 6px }

@media (max-width: 1000px) {
  /* on smaller screens, keep preview in flow */
  .preview { position: static; top: auto; right: auto; width: 100%; max-width: none }
}

/* ensure pointer cursor on interactive elements (buttons, controls, list items) */
/* actionable elements: native and ARIA/tab-focusable controls */
button,
a,
input[type="button"],
input[type="submit"],
[role="button"],
[role="link"],
[tabindex]:not([tabindex="-1"]),
.preview-header,
.preview-hit,
.preview-toggle,
.preview-download-big,
.download-link,
.color-item,
.color-item[role="button"],
.color-item .color-box,
.palette-color-item,
.preview-img,
.download-btn {
  cursor: pointer;
}

/* disabled controls should show not-allowed (covers native disabled and aria-disabled) */
button:disabled,
input:disabled,
.preview-download-big:disabled,
.download-btn:disabled,
[aria-disabled="true"] {
  cursor: not-allowed;
}
</style>
