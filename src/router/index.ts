import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {
  publicRoutes,
  ROUTE_CREATE_TRANSCRIPT,
  ROUTE_LIST_TRANSCRIPT,
  ROUTE_LOGIN,
  ROUTE_REGISTER,
  ROUTE_SINGLE_TRANSCRIPT,
} from '@/router/routes'
import { account } from '@/services/appwrite'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: ROUTE_LOGIN,
      component: () => import('../views/auth/Login.vue'),
    },
    {
      path: '/register',
      name: ROUTE_REGISTER,
      component: () => import('../views/auth/Register.vue'),
    },
    {
      path: '/transcripts',
      name: ROUTE_LIST_TRANSCRIPT,
      component: () => import('../views/transcripts/List.vue'),
    },
    {
      path: '/transcripts/:id',
      name: ROUTE_SINGLE_TRANSCRIPT,
      component: () => import('../views/transcripts/Single.vue'),
    },
    {
      path: '/transcripts/create',
      name: ROUTE_CREATE_TRANSCRIPT,
      component: () => import('../views/transcripts/Create.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  try {
    await account.get()
  } catch (e) {
    if (to.name && to.name !== ROUTE_LOGIN && !publicRoutes.includes(to.name))
      return { name: ROUTE_LOGIN }
  }
})

export default router
