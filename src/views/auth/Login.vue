<template>
  <LayoutForm>
    <form @submit.prevent="login" class="grid gap-2">
      <Heading class="text-base-100 text-center">Transcript'</Heading>
      <FormGroup
        type="email"
        label="Email"
        placeholder="john.doe@email.com"
        v-model="state.email"
        required
      />
      <FormGroup
        label="Password"
        type="password"
        placeholder="password"
        v-model="state.password"
        required
      />
      <button
        type="submit"
        class="btn btn-accent btn-md justify-self-center mt-5"
      >
        Log in
      </button>
    </form>
    <p class="text-base-100 text-center mt-6">
      Not registered yet ?
      <RouterLink :to="{ name: ROUTE_REGISTER }" class="link-accent"
        >Register</RouterLink
      >
    </p>
  </LayoutForm>
</template>
<script setup lang="ts">
  import { account } from '@/services/appwrite'
  import { reactive } from 'vue'
  import LayoutForm from '@/components/LayoutForm.vue'
  import FormGroup from '@/components/FormGroup.vue'
  import { useToast } from 'vue-toastification'
  import { ROUTE_LIST_TRANSCRIPT, ROUTE_REGISTER } from '@/router/routes'
  import { useRouter } from 'vue-router'
  import Heading from '@/components/Heading.vue'

  const state = reactive({
    email: 'admin@test.com',
    password: 'password',
  })

  const toast = useToast()
  const router = useRouter()

  const login = async () => {
    try {
      await account.createEmailSession(state.email, state.password)
      toast.success(`You're connected`)
      await router.push({ name: ROUTE_LIST_TRANSCRIPT })
    } catch (e) {
      toast.error(e.message)
    }
  }
</script>
<style scoped></style>
