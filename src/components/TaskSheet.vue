<script setup>
import { reactive, watch, computed } from 'vue'
import BottomSheet from './BottomSheet.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  task: { type: Object, default: null },   // null = neu anlegen, sonst bearbeiten
  rings: { type: Array, required: true },  // verfügbare Kategorien zur Auswahl
})
const emit = defineEmits(['update:modelValue', 'save', 'delete'])

const form = reactive({ ringId: null, name: '', amount: 1, quadrant: 'q2' })

function stepFor(ring) {
  if (!ring) return 1
  if (ring.type === 'bool') return ring.goal
  if (ring.type === 'minutes') return Math.max(5, Math.round(ring.goal / 6))
  return 1
}

watch(
    () => [props.modelValue, props.task],
    ([open, task]) => {
      if (!open) return
      if (task) {
        form.ringId = task.ringId
        form.name = task.name
        form.amount = task.amount
        form.quadrant = task.quadrant
      } else {
        const firstRing = props.rings[0] || null
        form.ringId = firstRing?.id ?? null
        form.name = ''
        form.amount = stepFor(firstRing)
        form.quadrant = 'q2'
      }
    },
    { immediate: true }
)

// Ändert sich die gewählte Kategorie, den Mengen-Vorschlag passend nachziehen
watch(
    () => form.ringId,
    (ringId) => {
      const ring = props.rings.find(r => r.id === ringId)
      if (ring && !props.task) form.amount = stepFor(ring)
    }
)

const selectedRing = computed(() => props.rings.find(r => r.id === form.ringId))
const amountLabel = computed(() => {
  const ring = selectedRing.value
  if (!ring) return 'Menge'
  if (ring.type === 'minutes') return 'Minuten'
  if (ring.type === 'count') return 'Anzahl'
  return 'Menge (zählt als 1)'
})

const quadOptions = [
  { value: 'q1', label: 'wichtig · dringend' },
  { value: 'q2', label: 'wichtig · nicht dringend' },
  { value: 'q3', label: 'unwichtig · dringend' },
  { value: 'q4', label: 'unwichtig · nicht dringend' },
]

function handleSave(close) {
  if (!form.name.trim() || !form.ringId) return
  emit('save', { id: props.task?.id ?? null, data: { ...form } })
  close()
}
function handleDelete(close) {
  if (!props.task) return
  if (!confirm('Diese Aufgabe wirklich löschen?')) return
  emit('delete', props.task.id)
  close()
}
</script>

<template>
  <BottomSheet :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" v-slot="{ close }">
    <h3>{{ task ? 'Aufgabe bearbeiten' : 'Was steht an?' }}</h3>

    <div class="field-label">Aufgabe</div>
    <input v-model="form.name" placeholder="z.B. 20 Min laufen" />

    <div class="field-label">Kategorie</div>
    <div class="choice-row">
      <div
          v-for="ring in rings" :key="ring.id"
          class="choice" :class="{ active: form.ringId === ring.id }"
          @click="form.ringId = ring.id"
      >{{ ring.name }}</div>
      <p v-if="rings.length === 0" class="empty-hint">Erst eine Kategorie im Ringe-Tab anlegen.</p>
    </div>

    <template v-if="selectedRing?.type !== 'tasks'">
      <div class="field-label">{{ amountLabel }}</div>
      <input v-model.number="form.amount" type="number" min="1" :disabled="selectedRing?.type === 'bool'" />
    </template>

    <div class="field-label">Priorität</div>
    <div class="quad-pick">
      <div
          v-for="opt in quadOptions" :key="opt.value"
          class="qp" :class="{ active: form.quadrant === opt.value }"
          @click="form.quadrant = opt.value"
      >{{ opt.label }}</div>
    </div>

    <button class="go" @click="handleSave(close)">{{ task ? 'Speichern' : 'Aufgabe anlegen' }}</button>
    <button v-if="task" class="delete" @click="handleDelete(close)">Aufgabe löschen</button>
    <button class="cancel" @click="close">Abbrechen</button>
  </BottomSheet>
</template>