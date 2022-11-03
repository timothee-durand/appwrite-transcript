import { databases, storage } from "@/services/appwrite";
import type { Transcript } from "@/stores/transcripts";

export function getTranscripts() {
  return databases.listDocuments<Transcript>(
    import.meta.env.VITE_PODCAST_DB_ID,
    import.meta.env.VITE_PODCAST_COL_ID
  );
}

export function getTranscript(transcriptId:string ) {
  return databases.getDocument<Transcript>(
    import.meta.env.VITE_PODCAST_DB_ID,
    import.meta.env.VITE_PODCAST_COL_ID,
    transcriptId
  );
}

export async function getTranscriptFile(fileId:string) : Promise<object | undefined> {
  const fileUrl = await storage.getFileView(
    import.meta.env.VITE_PODCAST_BUCK_ID,
    fileId
  );
  console.log(fileUrl);
  if(!fileUrl) return
  return await fetch(fileUrl)
}


