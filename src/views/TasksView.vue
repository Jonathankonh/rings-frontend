<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTasks } from '../composables/useTasks.js'
import { useRings } from '../composables/useRings.js'
import TaskCard from '../components/TaskCard.vue'
import TaskSheet from '../components/TaskSheet.vue'
import RingProgress from '../components/RingProgress.vue'
import ErrorState from '../components/ErrorState.vue'

const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, toggleTask } = useTasks()
const { rings, fetchRings } = useRings()

onMounted(async () => {
  await Promise.all([fetchTasks(), fetchRings()])
})

const showSheet = ref(false)
const editingTask = ref(null)

function openCreate() {
  editingTask.value = null
  showSheet.value = true
}
function openEdit(task) {
  editingTask.value = task
  showSheet.value = true
}

async function handleSave({ id, data }) {
  if (id) await updateTask(id, data)
  else await createTask(data)
}
async function handleDelete(id) {
  await deleteTask(id)
}

// Aufgaben nach Kategorie gruppieren — Aufgaben ohne Kategorie (ringId: null,
// z.B. weil die Kategorie gelöscht wurde) landen in einer eigenen Gruppe.
const grouped = computed(() => {
  const groups = {}
  for (const task of tasks.value) {
    const key = task.ringId || '_none'
    if (!groups[key]) groups[key] = []
    groups[key].push(task)
  }
  return Object.entries(groups).map(([ringId, items]) => ({
    ring: rings.value.find(r => r.id === ringId) || null,
    items,
  }))
})
</script>

<template>
  <section class="block">
    <div class="block-head">
      <h2>alle aufgaben</h2>
    </div>

    <p v-if="loading">Lädt…</p>
    <ErrorState v-else-if="error" :message="`Aufgaben konnten nicht geladen werden: ${error}`" @retry="fetchTasks" />
    <p v-else-if="tasks.length === 0" class="empty-hint">Noch keine Aufgaben.</p>

    <div v-else v-for="group in grouped" :key="group.ring?.id || '_none'" class="group">
      <div class="group-head">
        <RingProgress
            v-if="group.ring"
            :value="group.ring.value" :goal="group.ring.goal" :color="group.ring.color" :size="22"
        />
        <div v-else class="group-dot" />
        <div class="group-name">{{ group.ring ? group.ring.name : 'Ohne Kategorie' }}</div>
        <div class="group-count">{{ group.items.filter(t => !t.done).length }} offen</div>
      </div>
      <TaskCard
          v-for="task in group.items" :key="task.id"
          :task="task"
          @toggle="toggleTask"
          @edit="openEdit"
      />
    </div>
  </section>

  <TaskSheet
      v-model="showSheet"
      :task="editingTask"
      :rings="rings"
      @save="handleSave"
      @delete="handleDelete"
  />

  <button class="fab" @click="openCreate">+ Aufgabe</button>
</template>

<style scoped>
.block-head { display: flex; align-items: center; justify-content: space-between; margin: 0 0 14px 2px; }
.block-head h2 { font-size: 13px; font-weight: 500; color: var(--ink-60); margin: 0; }
.error { color: var(--red); }
.empty-hint { color: var(--ink-35); font-size: 13px; }

.group { margin-bottom: 24px; }
.group-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; padding-left: 2px; }
.group-dot { width: 9px; height: 9px; border-radius: 50%; }
.group-name { font-size: 13px; font-weight: 600; }
.group-count { font-family: monospace; font-size: 11px; color: var(--ink-60); margin-left: auto; }

.fab {
  position: fixed; left: 50%; transform: translateX(-50%);
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  background: var(--ink); color: var(--paper); border: none; border-radius: 999px;
  padding: 14px 26px; font-weight: 600; font-size: 14px; cursor: pointer;
  box-shadow: 0 8px 24px rgba(17,17,17,0.18); z-index: 5;
}
</style>