import { databases } from '@/services/appwrite'
import type { Transcript } from '@/models/transcript'

export function getTranscripts() {
  return databases.listDocuments<Transcript>(
    import.meta.env.VITE_PODCAST_DB_ID,
    import.meta.env.VITE_PODCAST_COL_ID
  )
}
