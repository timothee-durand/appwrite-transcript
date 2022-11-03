import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import { OhVueIcon, addIcons } from 'oh-vue-icons'

import * as HiIcon from 'oh-vue-icons/icons/hi'

import * as ConfirmDialog from 'vuejs-confirm-dialog'

const Fa = Object.values({ ...HiIcon })
addIcons(...Fa)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast)
app.use(ConfirmDialog)
app.component('v-icon', OhVueIcon)

app.mount('#app')
