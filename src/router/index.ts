import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/routes'

import { useAuthStore } from '@/stores/auth'
import { useUsersToBusinessStore } from '@/stores/usersToBusiness'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore()
  await authStore.fetchSession()
  if (to.matched.some((record) => record.meta.requiresAuth && !authStore.isAuthenticated)) {
    const token = to.path.split('/').pop()
    if (token) localStorage.setItem('invite-token', token)
    next({ name: 'login' })
  }
  else if (authStore.isAuthenticated && to.path.startsWith('/auth')) next({ name: 'dashboard' })
  else if (to.matched.some((record) => record.meta.requiresBusinessInfos)) {
    if (localStorage.getItem('invite-token')) {
      const token = localStorage.getItem('invite-token')
      localStorage.removeItem('invite-token')

      next({ name: 'invite', params: { token }})
    }
    const userToBusinessStore = useUsersToBusinessStore()

    await authStore.fetchSession()
    await userToBusinessStore.getBusinessByUserId(authStore.session?.user?.id as string)

    if (!userToBusinessStore.business) next({ name: 'register-business' })
    else next()
  }
  else next()
})
