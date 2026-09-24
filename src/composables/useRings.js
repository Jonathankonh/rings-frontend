// src/composables/useRings.js
// Singleton: rings/loading/error existieren NUR EINMAL im ganzen Programm
// (deshalb außerhalb der Funktion deklariert, nicht drin). Jede Komponente,
// die useRings() aufruft, bekommt dieselbe geteilte Liste — wichtig, weil
// TasksView (beim Abhaken) und RingsView (bei der Anzeige) dieselben
// Ring-Werte sehen müssen, nicht zwei getrennte Kopien.

import { ref } from 'vue'
import * as api from '../api.js'

const rings = ref([])
const loading = ref(true)
const error = ref(null)

async function fetchRings() {
    loading.value = true
    try {
        rings.value = await api.getRings()
        error.value = null
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

async function createRing(data) {
    const created = await api.createRing(data)
    rings.value.push(created)
    return created
}

async function updateRing(id, data) {
    const updated = await api.updateRing(id, data)
    const i = rings.value.findIndex(r => r.id === id)
    if (i !== -1) rings.value[i] = updated
    return updated
}

async function deleteRing(id) {
    await api.deleteRing(id)
    rings.value = rings.value.filter(r => r.id !== id)
}

// Wird von useTasks aufgerufen, wenn eine Aufgabe abgehakt wird und der
// Server den aktualisierten Ring zurückgibt — patcht die geteilte Liste,
// ohne alles neu vom Server zu laden.
function patchRingLocally(updatedRing) {
    if (!updatedRing) return
    const i = rings.value.findIndex(r => r.id === updatedRing.id)
    if (i !== -1) rings.value[i] = updatedRing
}

export function useRings() {
    return { rings, loading, error, fetchRings, createRing, updateRing, deleteRing, patchRingLocally }
}