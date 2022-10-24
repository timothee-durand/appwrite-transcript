<script setup lang="ts">

import {useTranscriptStore} from "@/stores/transcripts";
import AppHeader from "@/components/AppHeader.vue";

const transcriptStore = useTranscriptStore()
transcriptStore.getTranscripts()
</script>

<template>
  <main class=" ">
    <AppHeader/>
    <main class="max-w-5xl mx-auto px-4">
      <RouterView/>

    </main>
    <DialogsWrapper />
  </main>
</template>

<style scoped>
</style>
