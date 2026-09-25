<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import RingsView from './views/RingsView.vue'
import TasksView from './views/TasksView.vue'
import PrioritiesView from './views/PrioritiesView.vue'
import Sidebar from './components/Sidebar.vue'
import TaskSheet from './components/TaskSheet.vue'
import LoadingScreen from './components/LoadingScreen.vue'
import LoginScreen from './components/LoginScreen.vue'
import { useTasks } from './composables/useTasks.js'
import { useRings } from './composables/useRings.js'
import { authBridge } from './authBridge.js'

// ---------- auth ----------
const {
  isLoading: authLoading,
  isAuthenticated,
  loginWithRedirect,
  logout: auth0Logout,
  user,
  getAccessTokenSilently,
} = useAuth0()

authBridge.getAccessTokenSilently = getAccessTokenSilently // api.js kann ab jetzt Tokens holen

function login() { loginWithRedirect() }
function signup() { loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } }) }
function handleLogout() { auth0Logout({ logoutParams: { returnTo: window.location.origin } }) }

// ---------- theme ----------
const theme = ref(localStorage.getItem('theme') || 'system')
function applyTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme.value === 'dark' || (theme.value === 'system' && prefersDark)
  if (theme.value === 'system') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.setAttribute('data-theme', theme.value)
  document.getElementById('theme-color-meta')?.setAttribute('content', isDark ? '#1f1f22' : '#f6f6f4')
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
  const wd = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  const now = new Date()
  dateLabel.value = `${wd[now.getDay()]}, ${now.getDate()}. ${now.toLocaleDateString('de-DE', { month: 'long' })}`
}
renderDate()
setInterval(renderDate, 60 * 1000)

// ---------- tabs ----------
const activeTab = ref('rings')
const tabTitles = { rings: 'Heute', tasks: 'Aufgaben', priorities: 'Prioritäten' }
const pageTitle = computed(() => tabTitles[activeTab.value])

// ---------- data ----------
const { rings, fetchRings } = useRings()
const { tasks, fetchTasks, createTask } = useTasks()

// appReady ist jetzt ein einmaliger Schalter, kein Live-Abbild des
// Ladezustands mehr — er springt genau EINMAL auf true und bleibt es,
// statt bei jedem Nachladen wieder hin- und herzuspringen.
const appReady = ref(false)
watch(isAuthenticated, async (loggedIn) => {
  if (loggedIn && !appReady.value) {
    await Promise.all([fetchRings(), fetchTasks()])
    appReady.value = true
  }
}, { immediate: true })

const showAddTask = ref(false)
async function handleCreateTask({ data }) {
  await createTask(data)
}
</script>

<template>
  <LoadingScreen v-if="authLoading || (isAuthenticated && !appReady)" />
  <LoginScreen v-else-if="!isAuthenticated" @login="login" @signup="signup" />

  <div v-else class="shell">
    <Sidebar class="sidebar-desktop" :active-tab="activeTab" :rings="rings" @update:active-tab="activeTab = $event" />

    <div class="main app-container">
      <header class="top">
        <div class="id">
          <span class="date">{{ dateLabel }}</span>
          <h1>{{ pageTitle }}</h1>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="user-email">{{ user?.email }}</span>
          <button class="desktop-add-btn" @click="showAddTask = true">Neue Aufgabe</button>
          <button class="logout-btn" @click="handleLogout">Abmelden</button>
          <button class="theme-toggle" @click="toggleTheme" aria-label="Modus wechseln">
            <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>
          </button>
        </div>
      </header>

      <RingsView v-if="activeTab === 'rings'" />
      <TasksView v-if="activeTab === 'tasks'" />
      <PrioritiesView v-if="activeTab === 'priorities'" />

      <nav class="pill-nav">
        <button :class="{ active: activeTab === 'rings' }" @click="activeTab = 'rings'">Heute</button>
        <button :class="{ active: activeTab === 'tasks' }" @click="activeTab = 'tasks'">Aufgaben</button>
        <button class="add-btn" aria-label="Neue Aufgabe" @click="showAddTask = true">
          <svg width="18" height="18" viewBox="0 0 16 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 2v12M2 8h12"/></svg>
        </button>
        <button :class="{ active: activeTab === 'priorities' }" @click="activeTab = 'priorities'">Prioritäten</button>
      </nav>

      <TaskSheet v-model="showAddTask" :task="null" :rings="rings" @save="handleCreateTask" />
    </div>
  </div>
</template>

<style scoped>
.top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; }
.date { font-size: 13px; color: var(--ink-60); display: block; }
.top h1 { font-size: 38px; font-weight: 600; letter-spacing: -0.035em; line-height: 1.1; margin: 2px 0 0; }

.user-email { font-size: 12px; color: var(--ink-60); display: none; }
@media (min-width: 700px) { .user-email { display: inline; } }

.logout-btn { border: none; background: transparent; color: var(--ink-60); font-size: 13px; cursor: pointer; padding: 0 4px; }

.theme-toggle {
  width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--line);
  background: var(--surface); color: var(--ink); display: grid; place-items: center;
  cursor: pointer; padding: 0; flex: none;
}
.theme-toggle svg { width: 18px; height: 18px; }

.pill-nav {
  position: fixed; left: 50%; transform: translateX(-50%); bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  width: calc(100% - 40px); max-width: 520px;
  margin: 0 auto; padding: 5px; border-radius: 999px; background: var(--surface); border: 1px solid var(--line);
  display: grid; grid-template-columns: 1fr 1fr 46px 1fr; align-items: center; gap: 3px;
  font-size: 12.5px; font-weight: 500; text-align: center; z-index: 5;
}
.pill-nav button { border: none; background: transparent; color: var(--ink-60); padding: 11px 0; border-radius: 999px; cursor: pointer; font: inherit; }
.pill-nav button.active { background: var(--paper-2); color: var(--ink); }
.pill-nav .add-btn { width: 46px; height: 46px; border-radius: 50%; background: var(--ink); color: var(--paper); display: grid; place-items: center; padding: 0; }

.sidebar-desktop { display: none; }
.desktop-add-btn { display: none; }

@media (min-width: 1000px) {
  .shell { display: grid; grid-template-columns: 232px 1fr; max-width: 1280px; margin: 0 auto; }
  .sidebar-desktop { display: flex; }
  .pill-nav { display: none; }
  .shell .main.app-container { max-width: none; margin: 0; padding: 32px 40px; }
  .desktop-add-btn {
    display: inline-flex; align-items: center; height: 42px; padding: 0 18px; border-radius: 999px;
    border: none; background: var(--ink); color: var(--paper); font-size: 14px; font-weight: 500; cursor: pointer;
  }
  .top { align-items: flex-end; }
}
</style>