// src/composables/useTasks.js
// Singleton wie useRings.js. Wichtig: toggleTask() ruft NICHT nur die
// Aufgabe um, sondern lässt sich vom Backend auch den aktualisierten Ring
// zurückgeben (server.js macht beides in einem Request) und schreibt den
// direkt in useRings() zurück — deshalb der Import von useRings hier.

import { ref } from 'vue'
import * as api from '../api.js'
import { useRings } from './useRings.js'

const tasks = ref([])
const loading = ref(true)
const error = ref(null)

async function fetchTasks() {
    loading.value = true
    try {
        tasks.value = await api.getTasks()
        error.value = null
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

async function createTask(data) {
    const created = await api.createTask(data)
    tasks.value.unshift(created)
    return created
}

async function updateTask(id, data) {
    const updated = await api.updateTask(id, data)
    const i = tasks.value.findIndex(t => t.id === id)
    if (i !== -1) tasks.value[i] = updated
    return updated
}

async function deleteTask(id) {
    await api.deleteTask(id)
    tasks.value = tasks.value.filter(t => t.id !== id)
}

async function toggleTask(task) {
    const done = !task.done
    const { task: updatedTask, ring } = await api.toggleTask(task.id, {
        done,
        ringId: task.ringId,
        amount: task.amount,
    })
    const i = tasks.value.findIndex(t => t.id === task.id)
    if (i !== -1) tasks.value[i] = updatedTask
    useRings().patchRingLocally(ring) // Ring-Fortschritt sofort in der Ringe-Ansicht sichtbar
}

export function useTasks() {
    return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, toggleTask }
}