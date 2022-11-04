<template>
  <BaseLayout>
    <div
      class="single-podcast"
      v-if="state.transcript && state.transcriptFile"
      ref="container"
    >
      <div class="flex justify-between mt-10">
        <Heading>{{ state.transcript.name }}</Heading>
        <AppBtn @click="saveAsDocx">Download as word</AppBtn>
      </div>
      <audio
        :src="state.audioFileUrl"
        controls
        class="block mx-auto mt-10"
        @timeupdate="setCurrentPlayerTime"
      ></audio>
      <section
        class="mt-10"
        v-for="(part, index) in wordsSortedByPart"
        :key="'part' + index"
      >
        <strong>{{ part?.speaker?.name ?? part?.speaker?.number }}</strong>
        <p>
          <span
            v-for="(word, index) in part.words"
            :key="'word-' + index"
            :class="{
              'text-primary':
                word.start < currentPlayerTime && word.end > currentPlayerTime,
            }"
          >
            {{ word.word }}
            {{ ' ' }}
          </span>
        </p>
      </section>
      <p></p>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { useToast } from 'vue-toastification'
  import { computed, reactive, ref } from 'vue'
  import type {
    FullTranscript,
    Speaker,
    Transcript,
    TranscriptFile,
    TranscriptWord,
  } from '@/models/transcript'
  import { functions, storage } from '@/services/appwrite'
  import Heading from '@/components/AppHeading.vue'
  import AppBtn from '@/components/AppBtn.vue'
  import { asBlob } from 'html-docx-js-typescript'
  import { saveAs } from 'file-saver'
  import BaseLayout from '@/components/BaseLayout.vue'
  import {
    extractSpeakerFromWords,
    getFullTranscript,
    sortTranscriptionByPart,
  } from '@/services/transcripts'
  import { Sentence } from '@/models/transcript'
  import { Blob } from 'buffer'

  interface SingleState extends FullTranscript {
    audioFileUrl: URL | undefined
    speakers: Speaker[]
  }

  const container = ref<HTMLElement | null>(null)
  const currentPlayerTime = ref(0)
  const state = reactive<SingleState>({
    transcript: undefined,
    transcriptFile: undefined,
    audioFileUrl: undefined,
    speakers: [],
  })

  const route = useRoute()
  const toast = useToast()
  let transcriptId = route.params.id
  if (!transcriptId) toast.error('Missing transcript ID')
  if (Array.isArray(transcriptId)) transcriptId = transcriptId.join('')

  function setCurrentPlayerTime({ target }: Event) {
    const audio = target as HTMLAudioElement
    if (audio && audio.currentTime) {
      currentPlayerTime.value = audio.currentTime
    }
  }

  getFullTranscript(transcriptId).then(async (result) => {
    if (!result) {
      toast.error('This transcript does not exist')
      return
    }
    state.transcript = result.transcript
    state.transcriptFile = result.transcriptFile
    if (!state.transcript) return
    state.audioFileUrl = storage.getFileView(
      '635425752912fbd16b02',
      state.transcript.audioFileId
    )

    if (!state.transcriptFile) return
    if (state.speakers.length === 0)
      state.speakers = extractSpeakerFromWords(state.transcriptFile.words)
  })

  const wordsSortedByPart = computed<Sentence[]>(() => {
    if (!state.transcriptFile || !state.transcriptFile.words) return []
    return sortTranscriptionByPart(state.transcriptFile.words, state.speakers)
  })

  async function saveAsDocx() {
    if (!container.value) return
    const htmlString = container.value.outerHTML.replace('Download as word', '')
    const blob = await asBlob(htmlString)
    const fileName =
      (state.transcript ? state.transcript.name : 'podcast') +
      '-transcript.docx'
    saveAs(blob, fileName)
  }
</script>

<style scoped lang="scss">
  .single-podcast {
    .audio {
      display: block;
      margin: auto;
    }
  }
</style>
