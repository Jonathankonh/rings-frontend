<template>
  <div class="loading-screen">
    <div class="brand">Ringe</div>
    <div class="bar-track">
      <div class="bar-fill" />
    </div>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed; inset: 0; background: var(--paper); color: var(--ink);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px;
  z-index: 100;
}
.brand { font-size: 22px; font-weight: 600; letter-spacing: -0.03em; }

.bar-track {
  width: 140px; height: 4px; border-radius: 999px; background: var(--line); overflow: hidden;
}
.bar-fill {
  width: 40%; height: 100%; border-radius: 999px; background: var(--purple);
  animation: slide 1.1s ease-in-out infinite;
}
@keyframes slide {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}
</style>