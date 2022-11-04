import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {
  publicRoutes,
  ROUTE_ACCOUNT,
  ROUTE_CREATE_TRANSCRIPT,
  ROUTE_HOME,
  ROUTE_LIST_TRANSCRIPT,
  ROUTE_LOGIN,
  ROUTE_REGISTER,
  ROUTE_SINGLE_TRANSCRIPT,
} from '@/router/routes'
import { account } from '@/services/appwrite'
import { useTranscriptStore } from '@/stores/transcripts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_HOME,
      component: HomeView,
    },
    {
      path: '/login',
      name: ROUTE_LOGIN,
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: ROUTE_REGISTER,
      component: () => import('../views/auth/RegisterView.vue'),
    },
    {
      path: '/account',
      name: ROUTE_ACCOUNT,
      component: () => import('../views/auth/AccountView.vue'),
    },
    {
      path: '/transcripts',
      name: ROUTE_LIST_TRANSCRIPT,
      component: () => import('../views/transcripts/ListView.vue'),
    },
    {
      path: '/transcripts/:id',
      name: ROUTE_SINGLE_TRANSCRIPT,
      component: () => import('../views/transcripts/SingleView.vue'),
    },
    {
      path: '/transcripts/create',
      name: ROUTE_CREATE_TRANSCRIPT,
      component: () => import('../views/transcripts/CreateView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const store = useTranscriptStore()
  try {
    await account.get()
    store.isSession = true
  } catch (e) {
    store.isSession = false
    if (
      to.name &&
      to.name !== ROUTE_LOGIN &&
      typeof to.name === 'string' &&
      !publicRoutes.includes(to.name)
    ) {
      return { name: ROUTE_LOGIN }
    }
  }
})

export default router
