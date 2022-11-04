import { defineStore } from 'pinia'
import { getTranscripts } from '@/services/transcripts'
import type { Transcript } from '@/models/transcript'

interface TranscriptsStore {
  transcriptDocuments: Transcript[]
  isSession: boolean
}

export const useTranscriptStore = defineStore('transcripts', {
  state: (): TranscriptsStore => ({
    transcriptDocuments: [],
    isSession: false,
  }),
  getters: {
    getTranscript(state): (id: string) => Transcript | undefined {
      return (id: string) =>
        state.transcriptDocuments.find(({ $id }) => id === $id)
    },
  },
  actions: {
    async getTranscripts() {
      const result = await getTranscripts()
      this.transcriptDocuments = result.documents
    },
  },
})
