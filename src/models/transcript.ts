import type { Models } from 'appwrite'

export interface Transcript extends Models.Document {
  name: string
  transcriptFileId: string
  audioFileId: string
  authorId: string
}

export interface TranscriptWord {
  word: string
  start: number
  end: number
  confidence: number
  speaker: number
  speaker_confidence: number
  punctuated_word: string
}

export interface TranscriptFile {
  confidence: number
  transcript: string
  words: Array<TranscriptWord>
}
