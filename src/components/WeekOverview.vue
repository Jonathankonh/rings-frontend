<script setup>
import { computed } from 'vue'
import { useTasks } from '../composables/useTasks.js'

const { tasks } = useTasks()

function getWeekDates() {
  const today = new Date()
  const dow = today.getDay() // 0 = So .. 6 = Sa
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(today.getDate() + mondayOffset)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const weekData = computed(() => {
  const dates = getWeekDates()
  const labels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  const done = tasks.value.filter(t => t.done && t.completedAt).map(t => new Date(t.completedAt))
  const counts = dates.map(d => done.filter(cd => sameDay(cd, d)).length)
  const max = Math.max(1, ...counts)
  const today = new Date()
  return dates.map((d, i) => ({
    d: labels[i],
    count: counts[i],
    isFuture: d > today && !sameDay(d, today),
    h: Math.max(4, (counts[i] / max) * 48) + 'px',
  }))
})

const totalThisWeek = computed(() => weekData.value.reduce((s, w) => s + w.count, 0))
</script>

<template>
  <div class="week-card">
    <div class="head">
      <span class="title">Diese Woche</span>
      <span class="total">{{ totalThisWeek }} erledigt</span>
    </div>
    <div class="bars">
      <div v-for="w in weekData" :key="w.d" class="bar-col">
        <span class="bar" :style="{ height: w.isFuture ? '4px' : w.h, opacity: w.isFuture ? 0.3 : 1 }" />
        <span class="label">{{ w.d }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.week-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 18px 20px; margin-top: 16px;
}
.head { display: flex; justify-content: space-between; align-items: baseline; }
.title { font-size: 17px; font-weight: 600; letter-spacing: -0.02em; }
.total { font-size: 12px; color: var(--ink-60); font-family: 'DM Mono', monospace; }

.bars { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-top: 16px; align-items: end; height: 64px; }
.bar-col { display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; }
.bar { width: 100%; border-radius: 6px; background: var(--ink); transition: height 0.6s; }
.label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--ink-60); }
</style>