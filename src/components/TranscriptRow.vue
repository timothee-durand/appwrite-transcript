<template>
  <div
      class="grid grid-cols-3 gap-1 items-center px-10 py-5 bg-base-300 rounded-lg  text-base-content border-base-content border shadow-xl"
  >
    <p>{{ name }}</p>
    <p class="justify-self-center">{{ date }}</p>
    <div class="buttons justify-self-end flex gap-2">
      <Btn class="btn-warning" @click="emit('delete', id)"><v-icon name="hi-trash"/></Btn>
      <Btn class="btn-primary" @click="emit('edit', id)"><v-icon name="hi-pencil"/></Btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import dayjs from "dayjs";
import Btn from "@/components/Btn.vue";


const props = defineProps<{
  name: string;
  createdAt: string;
  id: string;
}>()

const date = computed(() => dayjs(props.createdAt).format("DD MMMM YYYY - HH:mm"))


const emit = defineEmits<{
  (e: 'delete', value: string): void
  (e: 'edit', value: string): void
}>()
</script>

<style scoped>

</style>
