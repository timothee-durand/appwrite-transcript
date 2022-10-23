<script setup lang="ts">
import {ID} from 'appwrite';
import {reactive} from "vue";
import {account, functions, storage} from "@/services/appwrite";
import {useTranscriptStore} from "@/stores/transcripts";

const user = reactive({
  name: "test",
  email: "admin@test.com",
  password: "password"
})

const userLogin = reactive({
  email: "admin@test.com",
  password: "password"
})

const register = async () => {
  try {
    const result = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
    )
    console.log(result)
  } catch (e) {
    console.error(e)
  }
}


const login = async () => {
  try {
    const result = await account.createEmailSession(
        user.email,
        user.password
    )
    console.log(result)
  } catch (e) {
    console.error(e)
  }
}

const transcriptStore = useTranscriptStore()
transcriptStore.getTranscripts()

const sendAudio = reactive<{ file: File | null, name: string, }>({
  file: null,
  name:"test"
})

const extractImage = ({target}: InputEvent) => {
  const input = target as HTMLInputElement;
  let fileList: FileList | null = input.files;
  if (fileList && fileList[0]) sendAudio.file = fileList[0];
};

const testFunction = async (e: InputEvent) => {
  if (!sendAudio.file) return

  try {
    const file = await storage.createFile("635425752912fbd16b02", "unique()", sendAudio.file)
    console.log(file)
    const execution = await functions.createExecution("63540502760ccfa58a10", JSON.stringify({
      bucketId: file.bucketId,
      fileId: file.$id,
      name: sendAudio.name
    }))
    console.log(JSON.parse(execution.response).data)

  } catch (e) {
    console.log(e)
  }
}


</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125"/>

    <div class="wrapper">
      <form @submit.prevent="register">
        <input type="text" placeholder="Timothée DURAND" v-model="user.name" required/>
        <input type="email" placeholder="john.doe@email.com" v-model="user.email" required/>
        <input type="password" placeholder="john.doe@email.com" v-model="user.password" required/>
        <button type="submit">Submit</button>
      </form>
    </div>

    <div class="wrapper">
      <form @submit.prevent="login">
        <input type="email" placeholder="john.doe@email.com" v-model="userLogin.email" required/>
        <input type="password" placeholder="john.doe@email.com" v-model="userLogin.password" required/>
        <button type="submit">Submit</button>
      </form>
    </div>

    <form @submit.prevent="testFunction">
      <input type="file" @change="extractImage" required accept="audio/*"/>
      <input type="text"  required v-model="sendAudio.name"/>
      <button type="submit">Submit</button>
    </form>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

form {
  display: grid;
}
</style>
