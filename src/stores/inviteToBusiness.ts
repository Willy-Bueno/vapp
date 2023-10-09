import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

interface Invite {
  id: string
  token: string
  role: string
}

interface Business {
  id: string
  name: string
  email: string
  phone: string
}

interface InviteToBusiness {
  invite_id: string
  business_id: string
}

export const useInviteToBusinessStore = defineStore('invite_to_business_store', {
  state: () => ({
    invite: null as Invite | null,
    business: null as Business | null,
  }),

  actions: {
    async getInviteByBusinessId(id: string) {
      const { data, error } = await supabase.from('invite_to_business').select('*, invites(*)').eq('business_id', id)
      if (error) throw error
      this.invite = data[0]?.invites
    },

    async getBusinessByInviteId(id: string) {
      const { data, error } = await supabase.from('invite_to_business').select('*, business(*)').eq('invite_id', id)
      if (error) throw error
      this.business = data[0]?.business
    },

    async addInviteToBusiness(payload: InviteToBusiness) {
      const { data, error } = await supabase.from('invite_to_business').insert(payload).select()
      if (error) throw error
      this.invite = data[0]
    }
  },

  persist: true
})
