<script setup>
import { reactive, watch } from 'vue'
import BottomSheet from './BottomSheet.vue'

// Formular für Anlegen UND Bearbeiten in einem. Kennt kein api.js —
// meldet nur "speichern" oder "löschen" mit den fertigen Daten nach außen.
// Die Elternkomponente (RingsView) entscheidet, was damit passiert.
const props = defineProps({
  modelValue: { type: Boolean, default: false }, // Sheet offen/zu
  ring: { type: Object, default: null },          // null = neu anlegen, sonst = bearbeiten
})
const emit = defineEmits(['update:modelValue', 'save', 'delete'])

const form = reactive({ name: '', type: 'minutes', goal: 30, color: 'purple' })

// Immer wenn das Sheet aufgeht, Formular passend befüllen — leer bei
// "neu", mit den bestehenden Werten bei "bearbeiten".
watch(
    () => [props.modelValue, props.ring],
    ([open, ring]) => {
      if (!open) return
      if (ring) {
        form.name = ring.name
        form.type = ring.type
        form.goal = ring.goal
        form.color = ring.color
      } else {
        form.name = ''
        form.type = 'minutes'
        form.goal = 30
        form.color = 'purple'
      }
    },
    { immediate: true }
)

const typeOptions = [
  { value: 'minutes', label: 'Minuten' },
  { value: 'count', label: 'Anzahl' },
  { value: 'bool', label: 'Ja/Nein' },
]
const colorOptions = [
  { value: 'purple', label: 'Lila' },
  { value: 'blue', label: 'Blau' },
  { value: 'red', label: 'Rot' },
  { value: 'yellow', label: 'Gelb' },
]

function handleSave(close) {
  if (!form.name.trim()) return
  emit('save', { id: props.ring?.id ?? null, data: { ...form } })
  close()
}
function handleDelete(close) {
  if (!props.ring) return
  if (!confirm('Diese Kategorie wirklich löschen?')) return
  emit('delete', props.ring.id)
  close()
}
</script>

<template>
  <BottomSheet :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" v-slot="{ close }">
    <h3>{{ ring ? 'Kategorie bearbeiten' : 'Neue Kategorie' }}</h3>

    <div class="field-label">Name</div>
    <input v-model="form.name" placeholder="z.B. Achtsamkeit" />

    <div class="field-label">Art des Ziels</div>
    <div class="choice-row">
      <div
          v-for="opt in typeOptions" :key="opt.value"
          class="choice" :class="{ active: form.type === opt.value }"
          @click="form.type = opt.value"
      >{{ opt.label }}</div>
    </div>

    <div class="field-label">Tagesziel</div>
    <input v-model.number="form.goal" type="number" min="1" />

    <div class="field-label">Farbe</div>
    <div class="choice-row">
      <div
          v-for="opt in colorOptions" :key="opt.value"
          class="choice" :class="{ active: form.color === opt.value }"
          @click="form.color = opt.value"
      >{{ opt.label }}</div>
    </div>

    <button class="go" @click="handleSave(close)">{{ ring ? 'Speichern' : 'Kategorie anlegen' }}</button>
    <button v-if="ring" class="delete" @click="handleDelete(close)">Kategorie löschen</button>
    <button class="cancel" @click="close">Abbrechen</button>
  </BottomSheet>
</template>