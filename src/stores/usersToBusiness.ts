import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Business } from '@/models'
import { Profile } from '@/models'

interface UserToBusiness {
  user_id: string
  business_id: string
}

export const useUsersToBusinessStore = defineStore('users_to_business_store', {
  state: () => ({
    business: null as Business | null,
    profiles: null as Profile[] | null | null
  }),

  actions: {
    async getBusinessByUserId(id: string) {
      const { data, error } = await supabase.from('users_to_business').select('*, business(*)').eq('user_id', id)
      if (error) throw error
      this.business = data.length > 0 ? data[0].business : null
    },

    async getUsersByBusinessId(id: string) {
      const { data, error } = await supabase.from('users_to_business').select('*, profiles(*)').eq('business_id', id)
      if (error) throw error
      this.profiles = data.map((d) => d.profiles).filter((profile): profile is any => profile !== null) as unknown as Profile[]
    }
    ,

    async addUserToBusiness(payload: UserToBusiness) {
      const { data: userToBusiness, error: userToBusinessError } = await supabase.from('users_to_business').select('*').eq('user_id', payload.user_id)
      if (userToBusinessError) throw userToBusinessError

      if (userToBusiness.length === 0) {
        const { error } = await supabase.from('users_to_business').insert(payload)
        if (error) throw error
      }
    }
  },

  persist: true
})
