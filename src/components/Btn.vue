<template>
  <button
    :type="type"
    class="btn"
    :class="`btn-${variant}`"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      type?: 'button' | 'submit'
      variant?: string
      disabled?: boolean
    }>(),
    { type: 'button', variant: 'accent' }
  )
</script>
