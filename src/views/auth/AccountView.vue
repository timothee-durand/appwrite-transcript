<template>
  <LayoutForm>
    <form @submit.prevent="register" class="grid gap-2">
      <Heading class="text-base-100 text-center">My account</Heading>
      <FormGroup
        label="Name"
        type="text"
        placeholder="Timothée DURAND"
        v-model="user.name"
      />
      <FormGroup
        label="Email"
        type="email"
        placeholder="john.doe@email.com"
        v-model="user.email"
      />
      <FormGroup
        label="Password"
        type="password"
        placeholder="password"
        v-model="user.password"
      />
      <FormGroup
        label="Old password"
        type="password"
        placeholder="password"
        v-model="user.oldPassword"
        required
      />
      <button type="submit" class="btn btn-accent justify-self-center mt-4">
        Update
      </button>
    </form>
  </LayoutForm>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { account } from '@/services/appwrite'
  import { Models } from 'appwrite'
  import LayoutForm from '@/components/LayoutForm.vue'
  import FormGroup from '@/components/FormGroup.vue'
  import { useToast } from 'vue-toastification'
  import { useRouter } from 'vue-router'
  import Heading from '@/components/AppHeading.vue'

  const user = reactive({
    name: '',
    email: '',
    password: '',
    oldPassword: '',
  })

  let oldAccount: Models.Account<{}> | null = null

  const toast = useToast()
  const router = useRouter()

  account.get().then((account) => {
    user.name = account.name
    user.email = account.email
    oldAccount = account
  })

  const register = async () => {
    try {
      if (!oldAccount) return
      if (user.name !== oldAccount.name) await account.updateName(user.name)
      if (user.email !== oldAccount.email)
        await account.updateEmail(user.email, user.oldPassword)
      if (user.password !== '')
        await account.updatePassword(user.password, user.oldPassword)
      toast.success('Update successful !')
    } catch (e) {
      toast.error(e.message)
    }
  }
</script>

<style scoped></style>
