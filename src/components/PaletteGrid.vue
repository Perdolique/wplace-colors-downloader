<template>
  <div class="palette-grid">
    <div
      v-for="(color, i) in colors"
      :key="i"
      class="palette-color-item"
      :class="{ used: usedSet && usedSet.has(color) }"
    >
      <div class="color-box" :style="{ backgroundColor: color === 'transparent' ? 'transparent' : color }">
        <div v-if="color === 'transparent'" class="transparent-pattern" />
        <span v-if="usedSet && usedSet.has(color)" class="badge" aria-hidden="true">✓</span>
      </div>
      <div class="color-name">{{ names[i] }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  colors: string[]
  names: string[]
  usedSet?: Set<string>
}>()
</script>

<style scoped>
.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(56px, 1fr));
  gap: 8px;
}

.palette-color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}


.color-box {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.12);
  box-shadow: 0 1px 2px rgba(16,24,40,0.04);
  position: relative;
  overflow: hidden;
}

.transparent-pattern {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  /* light checkerboard to make transparency visible against white backgrounds */
  background-color: #ffffff;
  background-image: linear-gradient(45deg, #e6e6e6 25%, transparent 25%),
                    linear-gradient(-45deg, #e6e6e6 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #e6e6e6 75%),
                    linear-gradient(-45deg, transparent 75%, #e6e6e6 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 0, 4px 4px, 4px 4px;
}

.color-name {
  font-size: 11px;
  text-align: center;
  margin-top: 6px;
  max-width: 56px;
}

.palette-color-item.used .color-box {
  outline: 2px solid var(--accent, #10b981);
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--accent, #10b981);
  color: #fff;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(16,24,40,0.12);
  transform: translate(30%, -30%);
}

/* auto-fit ensures wrapping and prevents overflow on large screens */
</style>
