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
    Transcript,
    TranscriptFile,
    TranscriptWord,
  } from '@/models/transcript'
  import { functions, storage } from '@/services/appwrite'
  import Heading from '@/components/AppHeading.vue'
  import AppBtn from '@/components/AppBtn.vue'
  import { asBlob } from 'html-docx-js-typescript'
  import { saveAs } from 'file-saver'
  import { useTranscriptStore } from '@/stores/transcripts'
  import BaseLayout from '@/components/BaseLayout.vue'

  interface Speaker {
    number: number
    name?: string
  }

  interface SingleStore {
    transcript: Transcript | undefined
    transcriptFile: TranscriptFile | undefined
    audioFileUrl: URL | undefined
    speakers: Speaker[]
  }

  const container = ref<HTMLElement | null>(null)

  const route = useRoute()
  const toast = useToast()
  let transcriptId = route.params.id
  if (!transcriptId) toast.error('Missing transcript ID')

  if (Array.isArray(transcriptId)) transcriptId = transcriptId.join('')

  const currentPlayerTime = ref(0)

  function setCurrentPlayerTime({ target }: Event) {
    const audio = target as HTMLAudioElement
    if (audio && audio.currentTime) {
      currentPlayerTime.value = audio.currentTime
    }
  }

  const state = reactive<SingleStore>({
    transcript: undefined,
    transcriptFile: undefined,
    audioFileUrl: undefined,
    speakers: [],
  })

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
      state.speakers = [
        ...new Set(state.transcriptFile.words.map(({ speaker }) => speaker)),
      ].map(
        (number): Speaker => ({
          number,
          name: `Speaker ${number}`,
        })
      )
  })

  class Sentence {
    speaker!: Speaker
    words: TranscriptWord[] = []
  }

  const wordsSortedByPart = computed<Sentence[]>(() => {
    if (!state.transcriptFile || !state.transcriptFile.words) return []
    const result: Sentence[] = []
    let previousSpeaker: number = state.transcriptFile.words[0].speaker
    let tempSentence: Sentence = new Sentence()
    state.transcriptFile.words.forEach((word) => {
      if (previousSpeaker === word.speaker) {
        tempSentence.words.push(word)
        if (!tempSentence.speaker)
          tempSentence.speaker = state.speakers.find(
            ({ number }) => word.speaker === number
          ) ?? { number: word.speaker }
        return
      }
      result.push(tempSentence)
      tempSentence = new Sentence()
      previousSpeaker = word.speaker
    })
    return result
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

  async function getFullTranscript(
    transcriptId: string
  ): Promise<SingleStore | undefined> {
    const fullTranscriptExecution = await functions.createExecution(
      '6362d4c54d41d1c37b0b',
      transcriptId
    )
    if (fullTranscriptExecution.status !== 'completed') {
      toast.error('An error occured')
      console.log(fullTranscriptExecution)
      return
    }
    return JSON.parse(fullTranscriptExecution.response)
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
