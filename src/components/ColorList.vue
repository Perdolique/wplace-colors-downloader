<template>
  <div class="color-list">
    <div class="list-header">
      <h3>{{ title }}</h3>
      <div class="header-actions">
        <button v-if="showSelectAll" @click.prevent="$emit('select-all')" class="select-all">{{ selectLabel || 'Select all' }}</button>
        <a v-if="downloadGroup" @click.prevent="$emit('download-group')" class="download-link">{{ downloadLabel }}</a>
      </div>
    </div>

    <div class="items">
      <div
        v-for="([color, count]) in items"
        :key="color"
        class="color-item"
        :class="{ selected: selected && selected.has(color) }"
        @click="$emit('toggle', color)
        "
      >
        <div class="color-box" :style="{ backgroundColor: color === 'transparent' ? 'transparent' : color }">
          <div v-if="color === 'transparent'" class="transparent-pattern" />
        </div>
        <div class="meta">{{ names.get(color) }}: {{ count }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  items: [string, number][]
  names: Map<string, string>
  selected?: Set<string>
  downloadGroup?: boolean
  downloadLabel?: string
  showSelectAll?: boolean
  selectLabel?: string
}>()
</script>

<style scoped>
.color-list { margin-top: 14px }
.list-header { display:flex; align-items:center; justify-content:space-between }
.download-link { color: var(--link, #2563eb); text-decoration: underline; cursor: pointer }
.header-actions { display:flex; gap:8px; align-items:center }
.select-all { background: #2563eb; color: #fff; border: none; padding:6px 10px; border-radius:6px; cursor:pointer }
.select-all:hover { background:#1e40af }
.items { margin-top: 10px; display:flex; flex-direction:column; gap:8px }
.color-item { display:flex; align-items:center; gap:10px; padding:6px; border-radius:8px }
.color-item.selected { background: rgba(37,99,235,0.08); border:1px solid rgba(37,99,235,0.18) }
.color-box {
  width:36px;
  height:36px;
  border-radius:6px;
  border:1px solid rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}
.transparent-pattern {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-color: #ffffff;
  background-image: linear-gradient(45deg, #e6e6e6 25%, transparent 25%),
                    linear-gradient(-45deg, #e6e6e6 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #e6e6e6 75%),
                    linear-gradient(-45deg, transparent 75%, #e6e6e6 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 0, 4px 4px, 4px 4px;
}
.meta { font-size:14px }
</style>
