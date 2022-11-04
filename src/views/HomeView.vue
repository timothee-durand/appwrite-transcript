<script setup lang="ts">
  import AppHeading from '@/components/AppHeading.vue'
  import { ROUTE_CREATE_TRANSCRIPT } from '@/router/routes'
</script>
<template>
  <main class="hero">
    <div class="hero-content text-center flex-col max-w-xl">
      <AppHeading class="">Transcript'</AppHeading>
      <p class="py-6">
        The app that use
        <a target="_blank" href="https://deepgram.com" class="link">Deepgram</a>
        to help you transcript your podcasts !
      </p>
      <router-link
        class="btn btn-primary"
        :to="{ name: ROUTE_CREATE_TRANSCRIPT }"
      >
        Get Started
      </router-link>
    </div>
  </main>
</template>
