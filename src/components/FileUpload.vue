<template>
  <div class="file-upload">
    <input ref="fileInput" type="file" @change="$emit('fileChange', $event)" accept="image/*" class="visually-hidden" />
    <button type="button" class="file-btn" @click="open">Upload image</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineEmits<{ fileChange: [event: Event] }>()
const fileInput = ref<HTMLInputElement | null>(null)
function open() {
  fileInput.value?.click()
}
</script>

<style scoped>
:root {
  --primary-color: #6366f1;
  --secondary-color: #f3f4f6;
  --border-radius: 12px;
}

.file-upload { width: 100%; margin-bottom: 18px }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0 }

/* styled button matching other prominent buttons in the app */
.file-btn {
  display: inline-block;
  width: 100%;
  padding: 10px 12px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
}
.file-btn:hover { background: #1e40af }

</style>
