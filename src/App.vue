<script setup lang="ts">
  import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <main class="app">
    <AppHeader />

    <RouterView />
    <DialogsWrapper />
  </main>
</template>

<style scoped>
  .app {
    display: grid;
    grid-template-rows: max-content 1fr;
    gap: 1rem;
    min-height: 100vh;
  }
</style>
