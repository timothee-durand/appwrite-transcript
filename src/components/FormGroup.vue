<template>
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text" :class="!lightMode && 'text-base-100'">{{
        label
      }}</span>
    </label>
    <slot>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="emitChange"
        :required="required"
        class="input input-bordered w-full text-base-content"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
  type InputType = 'text' | 'email' | 'password'
  withDefaults(
    defineProps<{
      label: string
      type?: InputType
      placeholder?: string
      modelValue?: string
      required?: boolean
      lightMode?: boolean
    }>(),
    { lightMode: false }
  )
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const emitChange = (e: InputEvent) => {
    emit('update:modelValue', e?.target?.value)
  }
</script>
<style scoped></style>
