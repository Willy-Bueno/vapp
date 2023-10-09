import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Profile } from '@/models'

interface ProfileInput {
  id: string
  email: string
  full_name: string
  avatar_url: string
  role: string
  business: string
}

export const useProfileStore = defineStore('profile_store', {
  state: () => ({
    profile: null as Profile | null,
  }),

  actions: {
    async getProfileById(id: string) {
      const { data, error } = await supabase.from('profiles').select('*, business(*)').eq('id', id).single()
      if (error) throw error
      this.profile = data as unknown as Profile
    },

    async updateProfile(profile: Partial<ProfileInput>) {
      const { data, error } = await supabase.from('profiles').update(profile).eq('id', profile.id!).select().single()
      if (error) throw error
      this.profile = data as unknown as Profile
    }
  },

  persist: true
})
