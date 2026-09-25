<script setup>
defineEmits(['login', 'signup'])
</script>

<template>
  <div class="login-screen">
    <div class="brand">Ringe</div>
    <p class="tagline">Aufgaben, Kategorien und Prioritäten als schließbare Ringe.</p>
    <button class="primary" @click="$emit('login')">Einloggen</button>
    <button class="secondary" @click="$emit('signup')">Konto erstellen</button>
  </div>
</template>

<style scoped>
.login-screen {
  min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 14px; padding: 24px; text-align: center;
}
.brand { font-size: 28px; font-weight: 600; letter-spacing: -0.03em; }
.tagline { font-size: 14px; color: var(--ink-60); max-width: 280px; margin: 0 0 12px; }
.primary {
  width: 220px; padding: 13px; border: none; border-radius: 999px; background: var(--ink); color: var(--paper);
  font-size: 15px; font-weight: 600; cursor: pointer; font: inherit;
}
.secondary {
  width: 220px; padding: 11px; border: none; background: transparent; color: var(--ink-60);
  font-size: 13px; cursor: pointer; font: inherit;
}
</style>