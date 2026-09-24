<script setup>
const props = defineProps({ task: { type: Object, required: true } })
const emit = defineEmits(['toggle', 'edit'])

const quadLabel = {
  q1: 'wichtig · dringend',
  q2: 'wichtig · nicht dringend',
  q3: 'unwichtig · dringend',
  q4: 'unwichtig · nicht dringend',
}
</script>

<template>
  <div class="task-row">
    <div
        class="task-check" :class="{ checked: task.done }"
        @click.stop="emit('toggle', task)"
    />
    <div class="task-name" :class="{ done: task.done }" @click="emit('edit', task)">
      {{ task.name }}
    </div>
    <div class="task-meta" @click="emit('edit', task)">{{ quadLabel[task.quadrant] }}</div>
  </div>
</template>

<style scoped>
.task-row { display: flex; align-items: center; gap: 12px; padding: 12px 4px; border-bottom: 1px solid var(--line); }
.task-row:last-child { border-bottom: none; }
.task-check {
  width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid var(--line);
  display: flex; align-items: center; justify-content: center; flex: 0 0 auto; cursor: pointer;
}
.task-check.checked { background: var(--green); border-color: var(--green); }
.task-check.checked::after {
  content: ''; width: 8px; height: 5px; border-left: 2px solid white; border-bottom: 2px solid white;
  transform: rotate(-45deg) translateY(-1px);
}
.task-name { flex: 1; font-size: 14px; cursor: pointer; }
.task-name.done { color: var(--ink-35); text-decoration: line-through; }
.task-meta { font-family: monospace; font-size: 11px; color: var(--ink-60); cursor: pointer; }
</style>