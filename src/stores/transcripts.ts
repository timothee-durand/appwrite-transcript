import { defineStore } from "pinia";
import { databases } from "@/services/appwrite";
import type { Models } from "appwrite";
import { getTranscripts } from "@/services/transcripts";
import type { Transcript, TranscriptsStore } from "@/models/transcript";

export const useTranscriptStore = defineStore("transcripts", {
  state: (): TranscriptsStore => ({

    transcriptDocuments: []
  }),
  getters: {
    getTranscript(state): (id: string) => Transcript | undefined {
      return (id: string) => state.transcriptDocuments.find(({ $id }) => id === $id);
    }
  },
  actions: {
    async getTranscripts() {
      const result = await getTranscripts()
      this.transcriptDocuments = result.documents;
    }
  }
});
