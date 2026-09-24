// src/composables/useRings.js
// The single source of truth for ring data on the frontend. Any component
// that needs rings uses this — never calls api.js directly for rings.
// Same idea as db.js on the backend: one place, not duplicated everywhere.

import { ref } from 'vue'
import * as api from '../api.js'

export function useRings() {
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

    return { rings, loading, error, fetchRings, createRing, updateRing, deleteRing }
}