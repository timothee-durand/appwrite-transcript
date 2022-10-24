import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import {databases} from "@/services/appwrite";
import type {Models} from "appwrite";

export interface Transcript extends Models.Document {
    name: string;
    transcriptId: string;
    authorId: string;
}

interface TranscriptsStore {
    transcriptDocuments: Transcript[]
}

export const useTranscriptStore = defineStore('transcripts', {
    state: (): TranscriptsStore => ({
        transcriptDocuments: []
    }),
    getters: {
    },
    actions: {
        async getTranscripts() {
            const result = await databases.listDocuments<Transcript>("6353f06c3bbe14ecda56", "6353f08ecb8b2766d8eb")
            this.transcriptDocuments = result.documents
        },

    }
})
