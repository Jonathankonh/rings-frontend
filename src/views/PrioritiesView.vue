<script setup>
import { onMounted, computed } from 'vue'
import { useTasks } from '../composables/useTasks.js'
import { useRings } from '../composables/useRings.js'
import ErrorState from '../components/ErrorState.vue'

const { tasks, fetchTasks, toggleTask, error } = useTasks()
const { rings, fetchRings } = useRings()
onMounted(() => { fetchTasks(); fetchRings() })


const quadOptions = [
  { value: 'q1', label: 'wichtig · dringend' },
  { value: 'q2', label: 'wichtig · nicht dringend' },
  { value: 'q3', label: 'unwichtig · dringend' },
  { value: 'q4', label: 'unwichtig · nicht dringend' },
]

function colorFor(task) {
  const ring = rings.value.find(r => r.id === task.ringId)
  return ring ? `var(--${ring.color})` : 'var(--ink-35)'
}

const quads = computed(() =>
    quadOptions.map(q => ({ ...q, tasks: tasks.value.filter(t => t.quadrant === q.value) }))
)
</script>

<template>
  <section class="block">
    <div class="block-head"><h2>Eisenhower-Matrix</h2></div>
    <ErrorState v-if="error" :message="`Aufgaben konnten nicht geladen werden: ${error}`" @retry="fetchTasks" />
    <div class="matrix">
      <div v-for="q in quads" :key="q.value" class="quad-card">
        <div class="quad-title">{{ q.label }}</div>
        <div
            v-for="task in q.tasks" :key="task.id"
            class="task-row" @click="toggleTask(task)"
        >
          <span class="dot" :style="{ background: colorFor(task) }" />
          <span class="title" :class="{ done: task.done }">{{ task.name }}</span>
        </div>
        <p v-if="q.tasks.length === 0" class="empty">leer</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.block-head h2 { font-size: 13px; font-weight: 500; color: var(--ink-60); margin: 0 0 14px 2px; }

.matrix { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (min-width: 700px) { .matrix { grid-template-columns: repeat(4, 1fr); } }

.quad-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 16px; display: flex; flex-direction: column; gap: 12px; min-height: 140px;
}
.quad-title { font-size: 17px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; }

.task-row { display: flex; gap: 8px; align-items: flex-start; cursor: pointer; }
.dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex: none; }
.title { font-size: 13.5px; line-height: 1.3; }
.title.done { text-decoration: line-through; opacity: 0.45; }
.empty { font-size: 12px; color: var(--ink-35); margin: 0; }
</style>