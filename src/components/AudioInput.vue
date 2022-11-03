<template>
  <label>
    <span class="inline-flex items-center gap-3">
      <span class="btn">{{ label }}</span>
      <span class="filename">{{ fileName }}</span>
    </span>
    <input
      type="file"
      @change="extractSoundFile"
      required
      accept="audio/*"
      class="hidden"
    />
  </label>
</template>
<script setup lang="ts">
  import { ref } from 'vue'

  defineProps<{
    label: string
  }>()

  const fileName = ref('')

  const extractSoundFile = ({ target }: InputEvent) => {
    const input = target as HTMLInputElement
    let fileList: FileList | null = input.files
    if (!fileList || !fileList[0]) return
    const file = fileList[0]
    emit('fileChange', file)
    fileName.value = file.name
  }

  const emit = defineEmits<{
    (e: 'fileChange', audio: File): void
  }>()
</script>
<style scoped>
  .filename {
    max-width: 50%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
