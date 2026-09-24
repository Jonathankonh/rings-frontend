<script setup>
defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])
function close() { emit('update:modelValue', false) }
</script>

<template>
  <Teleport to="body">
    <!-- Transition + v-if statt nur opacity: das Backdrop existiert im DOM
         nur während es sichtbar oder gerade am Ein-/Ausblenden ist. Das
         verhindert, dass Safari die Statusleiste nach einer unsichtbaren,
         aber technisch noch vorhandenen dunklen Fläche einfärbt. -->
    <Transition name="fade">
      <div v-if="modelValue" class="backdrop" @click="close" />
    </Transition>

    <div class="sheet" :class="{ open: modelValue }">
      <slot :close="close" />
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed; inset: 0; background: rgba(17, 17, 17, 0.32); z-index: 10;
}
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.sheet {
  position: fixed; left: 0; right: 0; bottom: 0; background: var(--surface);
  border-radius: 22px 22px 0 0; padding: 22px 20px calc(22px + env(safe-area-inset-bottom, 0px));
  transform: translateY(100%); transition: transform .3s cubic-bezier(.34,1,.4,1);
  z-index: 11; max-width: 560px; margin: 0 auto; max-height: 82vh; overflow-y: auto;
}
.sheet.open { transform: translateY(0); }
</style>