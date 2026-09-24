<script setup>
import { ref } from 'vue'
import RingsView from './views/RingsView.vue'

// ---------- theme ----------
const theme = ref(localStorage.getItem('theme') || 'system')
function applyTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme.value === 'dark' || (theme.value === 'system' && prefersDark)
  if (theme.value === 'system') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.setAttribute('data-theme', theme.value)
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

// ---------- tabs ----------
const activeTab = ref('rings') // später auch 'tasks', 'priorities'
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
      <button :class="{ active: activeTab === 'rings' }" @click="activeTab = 'rings'">Ringe</button>
      <button disabled title="kommt als Nächstes">Aufgaben</button>
      <button disabled title="kommt als Nächstes">Prioritäten</button>
    </nav>

    <RingsView v-if="activeTab === 'rings'" />
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
</style>