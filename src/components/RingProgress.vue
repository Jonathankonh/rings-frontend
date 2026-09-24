<script setup>
import { computed, ref, watch } from 'vue'
import { colorVarFor } from '../colors.js'

const props = defineProps({
  value: { type: Number, required: true },
  goal: { type: Number, required: true },
  color: { type: String, default: 'purple' },
  size: { type: Number, default: 112 },
})

const r = computed(() => props.size * 0.41)
const circumference = computed(() => 2 * Math.PI * r.value)
const pct = computed(() => Math.min(props.value / props.goal, 1))
const offset = computed(() => circumference.value * (1 - pct.value))
const strokeColor = computed(() => (pct.value >= 1 ? 'var(--green)' : colorVarFor(props.color)))

// Löst den Schließ-Effekt genau EINMAL aus — beim Übergang von "nicht voll"
// zu "voll". oldVal ist beim allerersten Aufruf undefined, nicht < 1 — das
// verhindert, dass der Effekt beim Laden einer bereits vollen Seite feuert.
const celebrating = ref(false)
watch(pct, (newVal, oldVal) => {
  if (oldVal !== undefined && oldVal < 1 && newVal >= 1) {
    celebrating.value = true
    setTimeout(() => (celebrating.value = false), 900)
  }
})
</script>

<template>
  <div class="ring-wrap" :class="{ celebrate: celebrating }" :style="{ '--glow-color': strokeColor }">
    <div class="glow" />
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="ring-svg">
      <circle :cx="size / 2" :cy="size / 2" :r="r" class="ring-track" />
      <circle
          :cx="size / 2" :cy="size / 2" :r="r"
          class="ring-fill"
          :stroke="strokeColor"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="offset"
      />
    </svg>
  </div>
</template>

<style scoped>
.ring-wrap { position: relative; display: inline-flex; }
.ring-svg { display: block; position: relative; z-index: 1; }
.ring-track { fill: none; stroke: var(--line); stroke-width: 9; }
.ring-fill {
  fill: none; stroke-width: 9; stroke-linecap: round;
  transform: rotate(-90deg); transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.7s cubic-bezier(.34,1.2,.4,1), stroke .3s ease;
}

/* Sanftes Aufblitzen hinter dem Ring — ein einzelner, auslaufender Puls,
   keine Konfetti, kein Dauer-Glanz. */
.glow {
  position: absolute; inset: 0; border-radius: 50%;
  background: radial-gradient(circle, var(--glow-color) 0%, transparent 70%);
  opacity: 0; z-index: 0; pointer-events: none;
}
.ring-wrap.celebrate .glow {
  animation: glow-pulse 0.9s ease-out;
}
.ring-wrap.celebrate .ring-svg {
  animation: ring-pop 0.6s cubic-bezier(.34, 1.56, .64, 1);
}

@keyframes glow-pulse {
  0%   { opacity: 0.45; transform: scale(0.8); }
  100% { opacity: 0; transform: scale(1.35); }
}
@keyframes ring-pop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.07); }
  100% { transform: scale(1); }
}
</style>