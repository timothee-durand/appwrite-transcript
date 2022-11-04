<template>
  <BaseLayout>
    <Heading class="mb-10 mt-4">My transcripts</Heading>
    <div class="grid gap-3">
      <TranscriptRow
        v-for="transcript in transcriptStore.transcriptDocuments"
        :key="transcript.$id"
        :id="transcript.$id"
        :name="transcript.name"
        :created-at="transcript.$createdAt"
        @delete="deleteTranscript"
      />
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
  import { useTranscriptStore } from '@/stores/transcripts'
  import Heading from '@/components/AppHeading.vue'
  import TranscriptRow from '@/components/TranscriptRow.vue'
  import { createConfirmDialog } from 'vuejs-confirm-dialog'
  import ConfirmModal from '@/components/ConfirmModal.vue'
  import { databases } from '@/services/appwrite'
  import { useToast } from 'vue-toastification'
  import BaseLayout from '@/components/BaseLayout.vue'

  const transcriptStore = useTranscriptStore()
  transcriptStore.getTranscripts()

  const deleteModal = createConfirmDialog(ConfirmModal, {
    confirmText: 'Do you really want to delete this transcript ?',
  })

  const toast = useToast()

  const deleteTranscript = async (id: string) => {
    const result = await deleteModal.reveal()
    if (!result) return
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_PODCAST_DB_ID,
        import.meta.env.VITE_PODCAST_COL_ID,
        id
      )
      await transcriptStore.getTranscripts()
      toast.success('Transcript was successfully deleted')
    } catch (e) {
      toast.error(e.message)
    }
  }
</script>

<style scoped></style>
