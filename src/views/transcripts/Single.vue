<template>
  <div class="single-podcast" v-if="state.transcript && state.transcriptFile">
    <Heading>{{ state.transcript.name }}</Heading>
    <audio :src="state.audioFileUrl" controls class="audio" @timeupdate="setCurrentPlayerTime"></audio>
    <div class="part" v-for="(part, index) in wordsSortedByPart" :key="'part'+index">
      <p>{{part?.speaker?.name ?? part?.speaker?.number}}</p>
      <p><span v-for="(word, index) in part.words" :key="'word-'+index" :class="{'current' : word.start < currentPlayerTime && word.end > currentPlayerTime}">
        {{word.word}}
        {{' '}}
      </span></p>
    </div>
    <p>

    </p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { computed, reactive, ref } from "vue";
import type { Transcript, TranscriptFile, TranscriptWord } from "@/models/transcript";
import { functions, storage } from "@/services/appwrite";
import Heading from "@/components/Heading.vue";


interface Speaker {
  number: number;
  name?: string;
}

interface SingleStore {
  transcript: Transcript | undefined,
  transcriptFile: TranscriptFile | undefined,
  audioFileUrl: URL | undefined,
  speakers: Speaker[]
}

const route = useRoute();
const toast = useToast();
let transcriptId = route.params.id;
if (!transcriptId)
  toast.error("Missing transcript ID");

if (Array.isArray(transcriptId))
  transcriptId = transcriptId.join("");

const currentPlayerTime = ref(0)
function setCurrentPlayerTime({target} : Event) {
  const audio = target as HTMLAudioElement
  if(audio && audio.currentTime) {
    currentPlayerTime.value = audio.currentTime
  }

}

const state = reactive<SingleStore>({ transcript: undefined, transcriptFile: undefined, audioFileUrl: undefined, speakers : []});

getFullTranscript(transcriptId).then(async (result) => {
  if (!result) {
    toast.error("This transcript does not exist");
    return;
  }
  state.transcript = result.transcript;
  state.transcriptFile = result.transcriptFile;
  if (!state.transcript) return;
  state.audioFileUrl = storage.getFileView("635425752912fbd16b02", state.transcript.audioFileId);

  if(!state.transcriptFile) return
  if(state.speakers.length === 0) state.speakers = [...new Set(state.transcriptFile.words.map(({speaker}) =>  speaker))].map((number) : Speaker => ({number, name : `Speaker ${number}`}))
});


class Sentence {
  speaker!: Speaker
  words: TranscriptWord[] = []
}


const wordsSortedByPart = computed<Sentence[]>(() => {
  if (!state.transcriptFile || !state.transcriptFile.words) return [];
  const result: Sentence[] = [];
  let previousSpeaker: number = state.transcriptFile.words[0].speaker;
  let tempSentence: Sentence = new Sentence();
  state.transcriptFile.words.forEach((word) => {
    if (previousSpeaker === word.speaker) {
      tempSentence.words.push(word);
      if(!tempSentence.speaker)
        tempSentence.speaker = state.speakers.find(({number}) => word.speaker === number) ?? {number : word.speaker}
      return;
    }
  result.push(tempSentence);
    tempSentence = new Sentence();
    previousSpeaker = word.speaker;
  });
  return result;
});


async function getFullTranscript(transcriptId: string): Promise<SingleStore | undefined> {
  const fullTranscriptExecution = await functions.createExecution("6362d4c54d41d1c37b0b", transcriptId);
  if (fullTranscriptExecution.status !== "completed") {
    toast.error("An error occured");
    console.log(fullTranscriptExecution);
    return;
  }
  return JSON.parse(fullTranscriptExecution.response);
}


</script>

<style scoped lang="scss">
.single-podcast {
  .audio {
    display: block;
    margin: auto;
  }

  .current {
    color:red;
  }
}
</style>
