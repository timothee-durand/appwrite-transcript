import { functions, storage } from '@/services/appwrite'
import type { Models } from 'appwrite'

export async function uploadPodcastAudio(file: File): Promise<Models.File> {
  return await storage.createFile(
    import.meta.env.VITE_AUDIO_BUCK_ID,
    'unique()',
    file
  )
}

export function launchTranscription(file: Models.File, audioName: string) {
  return functions.createExecution(
    import.meta.env.VITE_TRANSCRIPT_FUNC_ID,
    JSON.stringify({
      bucketId: file.bucketId,
      audioFileId: file.$id,
      name: audioName,
    })
  )
}
