import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/routes'

import { useAuthStore } from '@/stores/auth'
import { useCompanyStore } from '@/stores/company'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore()
  await authStore.fetchSession()

  if (to.matched.some((record) => record.meta.requiresAuth && !authStore.isAuthenticated)) {
    const token = to.query.token as string
    if (token) localStorage.setItem('invite-token', token)
    next({ name: 'login' })
  }
  else if (authStore.isAuthenticated && to.path.startsWith('/auth')) next({ name: 'surveys' })
  else if (to.matched.some((record) => record.meta.requiresCompany)) {
    if (localStorage.getItem('invite-token')) {
      const token = localStorage.getItem('invite-token')
      localStorage.removeItem('invite-token')

      next({ name: 'invite', params: { token }})
    }
    const companyStore = useCompanyStore()

    await companyStore.getCompany()

    if (!companyStore.company) next({ name: 'add-company' })
    else next()
  }
  else next()
})
