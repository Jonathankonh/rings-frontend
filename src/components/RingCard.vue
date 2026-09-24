<script setup>
import RingProgress from './RingProgress.vue'

// Kennt nur EINEN Ring, weiß nichts von der ganzen Liste, nichts von API.
// Meldet per emit nur "ich wurde angeklickt" nach außen — die Elternkomponente
// entscheidet, was das bedeutet (Sheet öffnen, zum Bearbeiten).
const props = defineProps({ ring: { type: Object, required: true } })
defineEmits(['click'])

function subLabel(ring) {
  if (ring.type === 'minutes') return `${ring.value}/${ring.goal} min`
  if (ring.type === 'bool') return ring.value >= ring.goal ? 'erledigt' : 'offen'
  return `${ring.value}/${ring.goal}`
}
</script>

<template>
  <div class="ring-card" :class="{ done: ring.value >= ring.goal }" @click="$emit('click', ring)">
    <RingProgress :value="ring.value" :goal="ring.goal" :color="ring.color" />
    <div class="ring-label">{{ ring.name }}</div>
    <div class="ring-sub">{{ subLabel(ring) }}</div>
  </div>
</template>

<style scoped>
.ring-card { border: 1px solid var(--line); border-radius: var(--radius); padding: 22px 14px 18px; background: var(--surface); display: flex; flex-direction: column; align-items: center; gap: 12px; cursor: pointer; }
.ring-card.done { border-color: var(--green); }
.ring-label { font-size: 13px; font-weight: 600; }
.ring-sub { font-size: 11px; color: var(--ink-60); font-family: monospace; }
</style>