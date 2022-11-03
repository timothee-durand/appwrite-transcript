<template>
  <div class="confirm-modal p-2">
    <div
      class="confirm-modal__container bg-base-100 rounded-lg p-10 max-w-5/12"
    >
      <p class="text-xl font-bold mb-4">{{ confirmText }}</p>
      <div class="buttons flex gap-2 justify-center">
        <Btn class="btn-neutral" @click="emit('cancel')">Cancel</Btn>
        <Btn class="btn-warning" @click="emit('confirm')">Ok</Btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Btn from '@/components/Btn.vue'
  const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'confirm'): void
  }>()
  defineProps<{
    confirmText: string
  }>()
</script>

<style scoped lang="scss">
  .confirm-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);

    &__container {
      display: grid;
    }
  }
</style>
