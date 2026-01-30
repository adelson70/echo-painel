import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/app/stores/auth.store'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router