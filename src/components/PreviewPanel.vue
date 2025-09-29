<template>
  <div :class="['preview', { collapsed: !previewOpen }]">
    <button
      type="button"
      class="preview-header"
      @click.stop="$emit('toggle')"
      :aria-pressed="previewOpen"
      :aria-expanded="previewOpen"
    >
      <h4 class="preview-title">Filtered preview</h4>
      <span class="preview-toggle" aria-hidden="true">
        <span v-if="previewOpen">🔽</span>
        <span v-else>▶️</span>
      </span>
    </button>

    <button
      v-if="!previewOpen"
      class="preview-hit"
      @click="$emit('open')"
      aria-label="Open preview"
    />

    <div v-if="previewOpen">
      <div v-if="previewDataUrl">
        <img :src="previewDataUrl" alt="preview" class="preview-img" />
      </div>
      <div v-else class="preview-empty">
        <div v-if="imageLoaded === false && placeholderFilename">Preview for: {{ placeholderFilename }}</div>
        <div v-else>No preview yet. Select colors or use group downloads.</div>
      </div>
      <div class="preview-download-wrap">
        <button
          class="preview-download-big"
          @click="$emit('download')"
          :disabled="disabled"
          :aria-disabled="disabled"
        >
          Download Selected Colors
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  previewOpen: boolean
  previewDataUrl: string
  disabled?: boolean
  imageLoaded?: boolean
  placeholderFilename?: string
}>()
defineEmits<{
  (e: 'toggle'): void
  (e: 'open'): void
  (e: 'download'): void
}>()
</script>

<style scoped>
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
  transition: width 240ms ease, height 240ms ease, padding 200ms ease, opacity 200ms ease, transform 180ms ease;
  will-change: width, height, transform, opacity;
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
  background: transparent;
  padding: 6px 10px;
  height: 48px;
  border-radius: 6px;
  border: none;
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
  .preview { position: static; top: auto; right: auto; width: 100%; max-width: none }
}
</style>
