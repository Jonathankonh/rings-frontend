<script setup>
import { ref, reactive, onMounted } from 'vue'
import * as api from './api.js'

// ref() macht eine Variable "reaktiv" — ändert sich ihr Wert, aktualisiert
// Vue automatisch alles im <template>, das sie benutzt. Kein manuelles
// "neu rendern" nötig, wie im alten Prototyp mit renderDaily() etc.
const rings = ref([])
const loading = ref(true)
const error = ref(null)

// onMounted läuft einmal, sobald die Komponente im Browser erscheint —
// der richtige Moment, um Daten vom Backend zu laden.
onMounted(async () => {
  try {
    rings.value = await api.getRings()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

// Formular-Zustand fürs Ring-Anlegen. reactive() statt ref(), weil es ein
// zusammenhängendes Objekt mit mehreren Feldern ist.
const newRing = reactive({ name: '', type: 'minutes', goal: 30, color: 'purple' })

async function handleCreateRing() {
  if (!newRing.name.trim()) return
  const created = await api.createRing({ ...newRing })
  rings.value.push(created)   // sofort sichtbar, ohne neu zu laden
  newRing.name = ''
  newRing.goal = 30
}
</script>

<template>
  <div class="app">
    <header>
      <h1>Ringe</h1>
    </header>

    <p v-if="loading">Lädt…</p>
    <p v-else-if="error" class="error">Fehler: {{ error }}</p>

    <div v-else class="ring-row">
      <div v-for="ring in rings" :key="ring.id" class="ring-card">
        <div class="ring-name">{{ ring.name }}</div>
        <div class="ring-progress">{{ ring.value }} / {{ ring.goal }}</div>
      </div>
      <p v-if="rings.length === 0" class="empty">Noch keine Ringe — leg unten deinen ersten an.</p>
    </div>

    <form @submit.prevent="handleCreateRing" class="new-ring-form">
      <input v-model="newRing.name" placeholder="Name, z.B. Lesen" required />
      <select v-model="newRing.type">
        <option value="minutes">Minuten</option>
        <option value="count">Anzahl</option>
        <option value="bool">Ja/Nein</option>
      </select>
      <input v-model.number="newRing.goal" type="number" min="1" />
      <select v-model="newRing.color">
        <option value="purple">Lila</option>
        <option value="blue">Blau</option>
        <option value="red">Rot</option>
        <option value="yellow">Gelb</option>
      </select>
      <button type="submit">Kategorie anlegen</button>
    </form>
  </div>
</template>

<style scoped>
.app { max-width: 560px; margin: 0 auto; padding: 24px; font-family: sans-serif; }
.ring-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
.ring-card { border: 1px solid #ddd; border-radius: 12px; padding: 16px; min-width: 120px; }
.ring-name { font-weight: 600; margin-bottom: 6px; }
.ring-progress { color: #666; font-size: 13px; }
.error { color: #c0392b; }
.empty { color: #999; }
.new-ring-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.new-ring-form input, .new-ring-form select { padding: 8px; border: 1px solid #ccc; border-radius: 8px; }
.new-ring-form button { padding: 8px 16px; border: none; border-radius: 8px; background: #111; color: white; cursor: pointer; }
</style>