import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import {databases} from "@/services/appwrite";
import type {Models} from "appwrite";

interface Transcript extends Models.Document{
    name : string;
    transcriptId : string;
    authorId: string;
}

interface TranscriptsStore {
    transcriptDocuments : Models.DocumentList<Transcript> | null
}

export const useTranscriptStore = defineStore('transcripts', {
    state: () : TranscriptsStore => ({
        transcriptDocuments : null
    }),
    actions : {
        async getTranscripts() {
           this.transcriptDocuments =  await databases.listDocuments<Transcript>("6353f06c3bbe14ecda56", "6353f08ecb8b2766d8eb")
        }
    }
})
