import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

interface SignUpCredentials {
  first_name: string
  last_name: string
  email: string
  password: string
}

interface SignInCredentials {
  email: string
  password: string
}

interface MagicLinkCredentials {
  email: string
}

interface UpdatePasswordCredentials {
  password: string
}

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

    async signUpWithCredentials(input: SignUpCredentials) {
      const { data: userData } = await supabase.from('users').select('*').eq('email', input.email.toLocaleLowerCase()).single()
      if (userData) throw new Error('Esse email já está em uso')

      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: `${input.first_name} ${input.last_name}`
          }
        }
      })
      if (error) throw error
      console.log(data)
      return data
    },

    async signInWithCredentials(input: SignInCredentials) {
      const { error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      })

      if (error) {
        switch (error.message) {
          case 'Invalid login credentials':
            throw new Error('Email ou senha incorretos')
          default:
            throw error
        }
      }
    },

    async forgotPassword(input: MagicLinkCredentials) {
      const { data: userData } = await supabase.from('users').select('*').eq('email', input.email.toLocaleLowerCase()).single()
      if (!userData) throw new Error('Esse email não está cadastrado')

      const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: 'https://nuunesdev.netlify.app/settings'
      })
      if (error) throw error

      return userData
    },

    async updatePassword(input: UpdatePasswordCredentials) {
      const { data, error } = await supabase.auth.updateUser({
        password: input.password
      })
      if (error) throw error

      return data
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
