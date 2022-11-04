/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PODCAST_DB_ID: string
  readonly VITE_PODCAST_COL_ID: string
  readonly VITE_TRANSCRIPT_BUCK_ID: string
  readonly VITE_TRANSCRIPT_FUNC_ID: string
  readonly VITE_FULL_TRANSCRIPT_FUNC_ID: string
  readonly VITE_AUDIO_BUCK_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
