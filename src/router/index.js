import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainPage from '@/components/MainPage.vue'
import Autorization from '@/components/Autorization.vue'
import Account from '@/components/Account.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'autorization',
      component: Autorization,
    },
    {
      path: '/home',
      name: 'home',
      component: MainPage,
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
