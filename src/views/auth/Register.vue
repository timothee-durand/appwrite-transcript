<template>
  <LayoutForm>
    <form @submit.prevent="register" class="grid gap-2">
      <Heading class="text-base-100 text-center ">Transcript'</Heading>
      <FormGroup label="Name" type="text" placeholder="Timothée DURAND" v-model="user.name" required/>
      <FormGroup label="Email" type="email" placeholder="john.doe@email.com" v-model="user.email" required/>
      <FormGroup  label="Password" type="password" placeholder="password" v-model="user.password" required/>
      <button type="submit" class="btn btn-accent justify-self-center mt-4">Register</button>
      <p class="text-base-100 text-center mt-6">Already registered ? <RouterLink :to="{name : ROUTE_LOGIN}" class="link-accent">Login</RouterLink></p>
    </form>
  </LayoutForm>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import {account} from "@/services/appwrite";
import {ID} from "appwrite";
import LayoutForm from "@/components/LayoutForm.vue";
import FormGroup from "@/components/FormGroup.vue";
import {useToast} from "vue-toastification";
import {ROUTE_LIST_TRANSCRIPT, ROUTE_LOGIN} from "@/router/routes";
import {useRouter} from "vue-router";
import Heading from "@/components/Heading.vue";

const user = reactive({
  name: "test",
  email: "admin@test.com",
  password: "password"
})


const toast = useToast()
const router = useRouter()

const register = async () => {
  try {
    const result = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
    )
    toast.success("You're registered !")
    await router.push({name : ROUTE_LIST_TRANSCRIPT})
  } catch (e) {
    toast.error(e.message)
  }
}
</script>

<style scoped>

</style>
