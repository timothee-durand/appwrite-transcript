<template>
  <BaseLayout>
    <form @submit.prevent="sendAudio">
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
  </BaseLayout>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import Heading from '@/components/AppHeading.vue'
  import FormGroup from '@/components/FormGroup.vue'
  import AudioInput from '@/components/AudioInput.vue'
  import Btn from '@/components/AppBtn.vue'
  import { useToast } from 'vue-toastification'
  import { useRouter } from 'vue-router'
  import { ROUTE_SINGLE_TRANSCRIPT } from '@/router/routes'
  import BaseLayout from '@/components/BaseLayout.vue'
  import {
    launchTranscription,
    uploadPodcastAudio,
  } from '@/services/transcription'
  import {storage} from "@/services/appwrite";

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
      const file = await uploadPodcastAudio(audio.file)
      console.log({file})
      const fileMetadata = await storage.getFile(
          file.bucketId,
          file.$id
      )
      console.log({fileMetadata})
      const execution = await launchTranscription(file, audio.name)
      console.log({execution})
      if (execution.status === 'failed') {
        toast.error("An error occurred")
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
