<script setup>
// Generische Sheet-Hülle: Backdrop + von unten reinschiebendes Panel.
// v-model steuert offen/zu, der Inhalt kommt komplett per <slot> von außen —
// diese Komponente weiß nichts über Kategorien, Aufgaben o.ä.
defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])
function close() { emit('update:modelValue', false) }
</script>

<template>
  <Teleport to="body">
    <div class="backdrop" :class="{ open: modelValue }" @click="close" />
    <div class="sheet" :class="{ open: modelValue }">
      <slot :close="close" />
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed; inset: 0; background: rgba(17, 17, 17, 0.32);
  opacity: 0; pointer-events: none; transition: opacity .25s ease; z-index: 10;
}
.backdrop.open { opacity: 1; pointer-events: auto; }

.sheet {
  position: fixed; left: 0; right: 0; bottom: 0; background: var(--surface);
  border-radius: 22px 22px 0 0; padding: 22px 20px calc(22px + env(safe-area-inset-bottom, 0px));
  transform: translateY(100%); transition: transform .3s cubic-bezier(.34,1,.4,1);
  z-index: 11; max-width: 560px; margin: 0 auto; max-height: 82vh; overflow-y: auto;
}
.sheet.open { transform: translateY(0); }
</style>