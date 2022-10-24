/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PODCAST_DB_ID: string
    readonly VITE_PODCAST_COL_ID: string
    readonly VITE_PODCAST_BUCK_ID: string
    readonly VITE_TRANSCRIPT_FUNC_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
