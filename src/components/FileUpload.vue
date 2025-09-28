<template>
  <input type="file" @change="$emit('fileChange', $event)" accept="image/*" class="file-input">
</template>

<script setup lang="ts">
defineEmits<{ fileChange: [event: Event] }>()
</script>

<style scoped>
:root {
  --primary-color: #6366f1;
  --secondary-color: #f3f4f6;
  --border-radius: 12px;
}

.file-input {
  display: block;
  width: 100%;
  padding: 12px;
  border: 2px dashed var(--primary-color);
  border-radius: var(--border-radius);
  background-color: var(--secondary-color);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 24px;
  text-align: center;
  font-size: 1rem;
}

.file-input:hover {
  background-color: #e5e7eb;
  border-color: #4f46e5;
}
</style>
