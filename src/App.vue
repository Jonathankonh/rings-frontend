<script setup>
import { ref, reactive, onMounted } from 'vue'
import * as api from './api.js'
import RingProgress from './components/RingProgress.vue'
import BottomSheet from './components/BottomSheet.vue'

// ---------- theme ----------
const theme = ref(localStorage.getItem('theme') || 'system')
function applyTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme.value === 'dark' || (theme.value === 'system' && prefersDark)

  if (theme.value === 'system') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.setAttribute('data-theme', theme.value)

  // Browser-Chrome/Statusleiste passend zum aktuellen Theme einfärben
  document.getElementById('theme-color-meta')?.setAttribute('content', isDark ? '#1C1C1E' : '#FFFFFF')
}
function toggleTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const currentlyDark = theme.value === 'dark' || (theme.value === 'system' && prefersDark)
  theme.value = currentlyDark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
  applyTheme()
}
applyTheme()

// ---------- date ----------
const dateLabel = ref('')
function renderDate() {
  const wd = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  const now = new Date()
  dateLabel.value = `${wd[now.getDay()]}, ${now.getDate()}.${now.getMonth() + 1}.`
}
renderDate()
setInterval(renderDate, 60 * 1000)

// ---------- rings ----------
const rings = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try { rings.value = await api.getRings() }
  catch (err) { error.value = err.message }
  finally { loading.value = false }
})

function subLabel(ring) {
  if (ring.type === 'minutes') return `${ring.value}/${ring.goal} min`
  if (ring.type === 'bool') return ring.value >= ring.goal ? 'erledigt' : 'offen'
  return `${ring.value}/${ring.goal}`
}

// ---------- category sheet ----------
const showRingSheet = ref(false)
const newRing = reactive({ name: '', type: 'minutes', goal: 30, color: 'purple' })

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

function openRingSheet() {
  newRing.name = ''
  newRing.type = 'minutes'
  newRing.goal = 30
  newRing.color = 'purple'
  showRingSheet.value = true
}

async function handleCreateRing(close) {
  if (!newRing.name.trim()) return
  const created = await api.createRing({ ...newRing })
  rings.value.push(created)
  close()
}
</script>

<template>
  <div class="app-container">
    <header class="top">
      <div class="id">
        <h1>Ringe</h1>
        <span class="date">{{ dateLabel }}</span>
      </div>
      <button class="theme-toggle" @click="toggleTheme" aria-label="Farbmodus umschalten">
        <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.2A8.3 8.3 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2z"/></svg>
      </button>
    </header>

    <nav class="tabs">
      <button class="active">Ringe</button>
      <button disabled title="kommt als Nächstes">Aufgaben</button>
      <button disabled title="kommt als Nächstes">Prioritäten</button>
    </nav>

    <section class="block">
      <div class="block-head">
        <h2>heute</h2>
        <button class="add-inline" @click="openRingSheet">+ Kategorie</button>
      </div>

      <p v-if="loading">Lädt…</p>
      <p v-else-if="error" class="error">Fehler: {{ error }}</p>

      <div v-else class="ring-row">
        <div v-for="ring in rings" :key="ring.id" class="ring-card" :class="{ done: ring.value >= ring.goal }">
          <RingProgress :value="ring.value" :goal="ring.goal" :color="ring.color" />
          <div class="ring-label">{{ ring.name }}</div>
          <div class="ring-sub">{{ subLabel(ring) }}</div>
        </div>
        <p v-if="rings.length === 0" class="empty-hint">Noch keine Kategorie angelegt.</p>
      </div>
    </section>

    <!-- Kategorie-Sheet: exakt das Bottom-Sheet-Muster aus dem Prototyp -->
    <BottomSheet v-model="showRingSheet" v-slot="{ close }">
      <h3>Neue Kategorie</h3>

      <div class="field-label">Name</div>
      <input v-model="newRing.name" placeholder="z.B. Achtsamkeit" />

      <div class="field-label">Art des Ziels</div>
      <div class="choice-row">
        <div
            v-for="opt in typeOptions" :key="opt.value"
            class="choice" :class="{ active: newRing.type === opt.value }"
            @click="newRing.type = opt.value"
        >{{ opt.label }}</div>
      </div>

      <div class="field-label">Tagesziel</div>
      <input v-model.number="newRing.goal" type="number" min="1" />

      <div class="field-label">Farbe</div>
      <div class="choice-row">
        <div
            v-for="opt in colorOptions" :key="opt.value"
            class="choice" :class="{ active: newRing.color === opt.value }"
            @click="newRing.color = opt.value"
        >{{ opt.label }}</div>
      </div>

      <button class="go" @click="handleCreateRing(close)">Kategorie anlegen</button>
      <button class="cancel" @click="close">Abbrechen</button>
    </BottomSheet>
  </div>
</template>

<style scoped>
.top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
.id { display: flex; align-items: baseline; gap: 10px; }
.top h1 { font-size: 19px; font-weight: 600; margin: 0; color: var(--ink-60); }
.date { font-family: monospace; font-size: 12px; color: var(--ink-35); }
.theme-toggle { border: none; background: transparent; color: var(--ink-60); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.theme-toggle svg { width: 16px; height: 16px; }

.tabs { display: flex; gap: 22px; padding: 0 2px; margin-bottom: 30px; border-bottom: 1px solid var(--line); }
.tabs button { border: none; background: transparent; color: var(--ink-35); font-size: 14px; font-weight: 600; padding: 0 0 12px; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.tabs button.active { color: var(--ink); border-bottom-color: var(--ink); }
.tabs button:disabled { cursor: default; opacity: 0.4; }

.block-head { display: flex; align-items: center; justify-content: space-between; margin: 0 0 14px 2px; }
.block-head h2 { font-size: 13px; font-weight: 500; color: var(--ink-60); margin: 0; }
.add-inline { border: none; background: transparent; color: var(--purple); font-size: 12px; cursor: pointer; }

.ring-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
@media (min-width: 1000px) { .ring-row { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); } }

.ring-card { border: 1px solid var(--line); border-radius: var(--radius); padding: 22px 14px 18px; background: var(--surface); display: flex; flex-direction: column; align-items: center; gap: 12px; }
.ring-card.done { border-color: var(--green); }
.ring-label { font-size: 13px; font-weight: 600; }
.ring-sub { font-size: 11px; color: var(--ink-60); font-family: monospace; }
.empty-hint { color: var(--ink-35); font-size: 13px; }
.error { color: var(--red); }
</style>