<template>
  <form @submit.prevent="sendAudio" class="max-w-lg mx-auto">
    <Heading class="my-4">Create transcript</Heading>
    <div class="grid gap-4">
      <FormGroup label="Podcast" light-mode>
        <AudioInput label="Choose file" @fileChange="chooseFile" />
      </FormGroup>
      <FormGroup
        light-mode
        label="Name"
        placeholder="A great podcast name"
        type="text"
        required
        v-model="audio.name"
      />
      <Btn
        type="submit"
        class="justify-self-start mt-3"
        :class="{ 'btn-loading': isLoading }"
        >Submit</Btn
      >
    </div>
  </form>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { functions, storage } from '@/services/appwrite'
  import Heading from '@/components/Heading.vue'
  import FormGroup from '@/components/FormGroup.vue'
  import AudioInput from '@/components/AudioInput.vue'
  import Btn from '@/components/Btn.vue'
  import { useToast } from 'vue-toastification'
  import { useRouter } from 'vue-router'
  import { ROUTE_SINGLE_TRANSCRIPT } from '@/router/routes'

  const audio = reactive<{ file: File | null; name: string }>({
    file: null,
    name: '',
  })

  const isLoading = ref(false)

  const toast = useToast()
  const router = useRouter()

  const chooseFile = (file: File) => (audio.file = file)

  const sendAudio = async () => {
    if (!audio.file) {
      toast.error('There is no file')
      return
    }

    try {
      isLoading.value = true
      const file = await storage.createFile(
        '635425752912fbd16b02',
        'unique()',
        audio.file
      )
      const execution = await functions.createExecution(
        '63540502760ccfa58a10',
        JSON.stringify({
          bucketId: file.bucketId,
          audioFileId: file.$id,
          name: audio.name,
        })
      )
      console.log(execution)
      if (execution.status === 'failed') {
        toast.error(execution.stderr)
        return
      }
      const data = JSON.parse(execution.response)
      toast.success("Your podcast's transcript is successfully done")
      await router.push({
        name: ROUTE_SINGLE_TRANSCRIPT,
        params: { id: data?.data?.$id },
      })
    } catch (e) {
      toast.error(e.message)
    } finally {
      isLoading.value = false
    }
  }
</script>

<style scoped></style>
