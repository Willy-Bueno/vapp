import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Tables, Update } from '@/types'

export const useUserStore = defineStore('user_store', {
  state: () => ({
    user: null as Tables<'users'> | null
  }),

  actions: {
    async getUser() {
      const { data: { user }, error: getUserError } = await supabase.auth.getUser()
      if (getUserError) throw getUserError
      if (user === null) throw new Error('User not found')

      const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (error) throw error

      this.user = data
    },

    async updateUser(user: Update<'users'>) {
      await this.getUser()
      if (this.user === null) throw new Error('User not found')

      const { error } = await supabase.from('users').update(user).eq('id', this.user.id)
      if (error) throw error
    }
  }
})
