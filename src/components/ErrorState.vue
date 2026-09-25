<script setup>
defineProps({ message: { type: String, required: true } })
defineEmits(['retry'])
</script>

<template>
  <div class="error-state">
    <p class="text">{{ message }}</p>
    <button class="retry" @click="$emit('retry')">Erneut versuchen</button>
  </div>
</template>

<style scoped>
.error-state {
  background: var(--surface); border: 1px solid var(--red); border-radius: var(--radius);
  padding: 18px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start;
}
.text { margin: 0; font-size: 14px; color: var(--red); }
.retry {
  border: 1px solid var(--line); background: transparent; color: var(--ink);
  padding: 8px 16px; border-radius: 999px; font-size: 13px; cursor: pointer; font: inherit;
}
</style>