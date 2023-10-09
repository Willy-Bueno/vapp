import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth_store', {
  state: () => ({
    session: null as Session | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.session,
    isUser: (state) => !!state.session && state.session.user
  },

  actions: {
    async fetchSession() {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      this.session = data.session
    },

    async loginWithMagicLink(email: string) {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
    },

    async loginWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL,
        }
      })
      if (error) throw error
    },

    async logout() {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    }
  }
})
