<template>

</template>

<script setup lang="ts">
  import {reactive} from "vue";
  import type {Transcript} from "@/stores/transcripts";

  const state = reactive<Transcript | {}>({})
</script>

<style scoped>

</style>
