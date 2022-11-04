<template>
  <header class="bg-base-300">
    <nav class="max-w-5xl mx-auto flex justify-end p-5 gap-5 items-center">
      <router-link :to="{ name: ROUTE_HOME }" class="mr-auto font-bold">
        Transcript'
      </router-link>
      <template v-if="store.isSession">
        <router-link :to="{ name: ROUTE_LIST_TRANSCRIPT }">
          My transcripts
        </router-link>
        <router-link :to="{ name: ROUTE_ACCOUNT }"> My account </router-link>
        <button type="button" @click="logOut">Log out</button>
        <router-link
          :to="{ name: ROUTE_CREATE_TRANSCRIPT }"
          class="btn btn-accent btn-square btn-sm text-accent-content"
        >
          <v-icon name="hi-plus" />
        </router-link>
      </template>
      <template v-else>
        <router-link :to="{ name: ROUTE_LOGIN }" class="btn btn-accent">
          Log in
        </router-link>
        <router-link
          :to="{ name: ROUTE_REGISTER }"
          class="btn btn-accent btn-outline"
        >
          Register
        </router-link>
      </template>
    </nav>
  </header>
</template>

<script setup lang="ts">
  import {
    ROUTE_LIST_TRANSCRIPT,
    ROUTE_CREATE_TRANSCRIPT,
    ROUTE_ACCOUNT,
    ROUTE_HOME,
    ROUTE_LOGIN,
    ROUTE_REGISTER,
  } from '@/router/routes'
  import { account } from '@/services/appwrite'
  import { useRouter } from 'vue-router'
  import { useTranscriptStore } from '@/stores/transcripts'

  const store = useTranscriptStore()
  const router = useRouter()
  async function logOut() {
    await account.deleteSessions()
    await router.push({ name: ROUTE_HOME })
  }
</script>

<style scoped></style>
