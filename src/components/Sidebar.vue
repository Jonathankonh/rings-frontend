<script setup>
defineProps({ activeTab: { type: String, required: true }, rings: { type: Array, required: true } })
const emit = defineEmits(['update:activeTab'])
</script>

<template>
  <aside class="sidebar">
    <div class="brand">Rings</div>
    <nav class="nav">
      <button :class="{ active: activeTab === 'rings' }" @click="emit('update:activeTab', 'rings')">Heute</button>
      <button :class="{ active: activeTab === 'tasks' }" @click="emit('update:activeTab', 'tasks')">Aufgaben</button>
      <button :class="{ active: activeTab === 'priorities' }" @click="emit('update:activeTab', 'priorities')">Prioritäten</button>
    </nav>
    <div class="cats">
      <div class="cats-label">Kategorien</div>
      <div v-for="ring in rings" :key="ring.id" class="cat-row">
        <span class="dot" :style="{ background: `var(--${ring.color})` }" />{{ ring.name }}
      </div>
      <button class="add-cat" @click="emit('update:activeTab', 'rings')">+ Neue Kategorie</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar { padding: 28px 20px; border-right: 1px solid var(--line); display: flex; flex-direction: column; gap: 28px; }
.brand { font-size: 22px; font-weight: 600; letter-spacing: -0.03em; padding-left: 10px; }
.nav { display: flex; flex-direction: column; gap: 2px; font-size: 14.5px; font-weight: 500; }
.nav button { text-align: left; border: none; background: transparent; color: var(--ink-60); padding: 9px 12px; border-radius: 12px; cursor: pointer; font: inherit; }
.nav button.active { background: var(--surface); border: 1px solid var(--line); color: var(--ink); }
.cats-label { font-size: 11px; color: var(--ink-60); letter-spacing: 0.06em; text-transform: uppercase; padding: 0 12px 8px; }
.cat-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; font-size: 14px; }
.dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }
.add-cat { border: none; background: transparent; color: var(--ink-60); padding: 8px 12px; font-size: 14px; text-align: left; cursor: pointer; font: inherit; }
</style>