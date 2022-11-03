<template>
  <div
    class="grid grid-cols-3 gap-1 items-center px-10 py-5 bg-base-300 rounded-lg text-base-content border-base-content border shadow-xl"
  >
    <p>{{ name }}</p>
    <p class="justify-self-center">{{ date }}</p>
    <div class="buttons justify-self-end flex gap-2">
      <Btn class="btn-warning" @click="emit('delete', id)"
        ><v-icon name="hi-trash"
      /></Btn>
      <RouterLink :to="{name : ROUTE_SINGLE_TRANSCRIPT, params : {id}}" class="btn-primary btn" @click="emit('edit', id)">
        <v-icon name="hi-pencil" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import dayjs from 'dayjs'
  import Btn from '@/components/Btn.vue'
  import {ROUTE_SINGLE_TRANSCRIPT} from "@/router/routes";

  const props = defineProps<{
    name: string
    createdAt: string
    id: string
  }>()

  const date = computed(() =>
    dayjs(props.createdAt).format('DD MMMM YYYY - HH:mm')
  )

  const emit = defineEmits<{
    (e: 'delete', value: string): void
    (e: 'edit', value: string): void
  }>()
</script>

<style scoped></style>
