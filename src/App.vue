<script setup lang="ts">
  import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <main class=" ">
    <AppHeader />
    <main class="max-w-5xl mx-auto px-4">
      <RouterView />
    </main>
    <DialogsWrapper />
  </main>
</template>

<style scoped></style>
