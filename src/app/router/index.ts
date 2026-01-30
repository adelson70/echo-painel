import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/app/stores/auth.store'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  console.log('Navigating to:', to.fullPath)
  console.log('autenticado:', auth.isAuthenticated)
  console.log('autenticado (store):', auth)

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'Login' }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'Dashboard' }
  }
})

export default router