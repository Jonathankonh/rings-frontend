<script setup>
import { computed } from 'vue'
import { colorVarFor } from '../colors.js'

// Props = wie Argumente einer Funktion, nur für Komponenten. Wer
// <RingProgress :value="12" :goal="20" color="blue" /> schreibt,
// übergibt hier value/goal/color.
const props = defineProps({
  value: { type: Number, required: true },
  goal: { type: Number, required: true },
  color: { type: String, default: 'purple' },
  size: { type: Number, default: 112 }, // px — größer als der alte Prototyp-Default (84px)
})

const r = computed(() => props.size * 0.41)
const circumference = computed(() => 2 * Math.PI * r.value)
const pct = computed(() => Math.min(props.value / props.goal, 1))
const offset = computed(() => circumference.value * (1 - pct.value))
const strokeColor = computed(() => (pct.value >= 1 ? 'var(--green)' : colorVarFor(props.color)))
</script>

<template>
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
</template>

<style scoped>
.ring-svg { display: block; }
.ring-track { fill: none; stroke: var(--line); stroke-width: 9; }
.ring-fill {
  fill: none; stroke-width: 9; stroke-linecap: round;
  transform: rotate(-90deg); transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.7s cubic-bezier(.34,1.2,.4,1), stroke .3s ease;
}
</style>