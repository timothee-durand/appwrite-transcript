import { databases, functions } from '@/services/appwrite'
import type {
  FullTranscript,
  Speaker,
  Transcript,
  TranscriptWord,
} from '@/models/transcript'
import { Sentence } from '@/models/transcript'

export function getTranscripts() {
  return databases.listDocuments<Transcript>(
    import.meta.env.VITE_PODCAST_DB_ID,
    import.meta.env.VITE_PODCAST_COL_ID
  )
}

export async function getFullTranscript(
  transcriptId: string
): Promise<FullTranscript | undefined> {
  const fullTranscriptExecution = await functions.createExecution(
    import.meta.env.VITE_FULL_TRANSCRIPT_FUNC_ID,
    transcriptId
  )
  if (fullTranscriptExecution.status !== 'completed') {
    console.log(fullTranscriptExecution)
    throw new Error('An error occurred, see the console for more information')
  }
  return JSON.parse(fullTranscriptExecution.response)
}

export function sortTranscriptionByPart(
  words: TranscriptWord[],
  speakers: Speaker[]
): Sentence[] {
  const result: Sentence[] = []
  let previousSpeaker: number = words[0].speaker
  let tempSentence: Sentence = new Sentence()
  words.forEach((word) => {
    if (previousSpeaker === word.speaker) {
      tempSentence.words.push(word)
      if (!tempSentence.speaker)
        tempSentence.speaker = speakers.find(
          ({ number }) => word.speaker === number
        ) ?? { number: word.speaker }
      return
    }
    result.push(tempSentence)
    tempSentence = new Sentence()
    previousSpeaker = word.speaker
  })
  return result
}

export function extractSpeakerFromWords(words: TranscriptWord[]): Speaker[] {
  return [...new Set(words.map(({ speaker }) => speaker))].map(
    (number): Speaker => ({
      number,
      name: `Speaker ${number}`,
    })
  )
}
