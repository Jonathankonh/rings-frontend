<script setup>
import { ref, onMounted } from 'vue'
import { useRings } from '../composables/useRings.js'
import RingCard from '../components/RingCard.vue'
import RingSheet from '../components/RingSheet.vue'
import WeekOverview from '../components/WeekOverview.vue'
import ErrorState from '../components/ErrorState.vue'

const { rings, loading, error, fetchRings, createRing, updateRing, deleteRing } = useRings()
onMounted(fetchRings)

const showSheet = ref(false)
const editingRing = ref(null) // null = neu anlegen, sonst der Ring, der bearbeitet wird

function openCreate() {
  editingRing.value = null
  showSheet.value = true
}
function openEdit(ring) {
  editingRing.value = ring
  showSheet.value = true
}

async function handleSave({ id, data }) {
  if (id) await updateRing(id, data)
  else await createRing(data)
}
async function handleDelete(id) {
  await deleteRing(id)
}
</script>

<template>
  <section class="block">
    <div class="block-head">
      <h2>heute</h2>
      <button class="add-inline" @click="openCreate">+ Kategorie</button>
    </div>

    <p v-if="loading">Lädt…</p>
    <ErrorState v-else-if="error" :message="`Ringe konnten nicht geladen werden: ${error}`" @retry="fetchRings" />

    <div v-else class="ring-row">
      <RingCard v-for="ring in rings" :key="ring.id" :ring="ring" @click="openEdit" />
      <p v-if="rings.length === 0" class="empty-hint">Noch keine Kategorie angelegt.</p>
    </div>
    <WeekOverview />
  </section>

  <RingSheet
      v-model="showSheet"
      :ring="editingRing"
      @save="handleSave"
      @delete="handleDelete"
  />
</template>

<style scoped>
.block-head { display: flex; align-items: center; justify-content: space-between; margin: 0 0 14px 2px; }
.block-head h2 { font-size: 13px; font-weight: 500; color: var(--ink-60); margin: 0; }
.add-inline { border: none; background: transparent; color: var(--purple); font-size: 12px; cursor: pointer; }

.ring-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
@media (min-width: 1000px) { .ring-row { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); } }

.empty-hint { color: var(--ink-35); font-size: 13px; }
.error { color: var(--red); }
</style>