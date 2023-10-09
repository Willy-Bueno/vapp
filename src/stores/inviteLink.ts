import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

interface InviteLink {
  id: string
  token: string
  role: string
  business_id: string
}

interface Business {
  id: string
  name: string
  email: string
  phone: string
}

export const useInviteLinkStore = defineStore('invite_link_store', {
  state: () => ({
    inviteLink: null as InviteLink | null,
    business: null as Business | null,
  }),

  actions: {
    async getInviteById(id: string) {
      const { data, error } = await supabase.from('invite_links').select('*').eq('id', id).single()
      if (error) throw error
      this.inviteLink = data
    },

    async getBusinessByToken(token: string) {
      const { data, error } = await supabase.from('invite_links').select('*, business(*)').eq('token', token)
      if (error) throw error
      this.business = data[0].business
    },

    async getInviteByBusinessId(businessId: string) {
      const { data, error } = await supabase.from('invite_links').select('*').eq('business_id', businessId)
      if (error) throw error
      this.inviteLink = data[0]
    },

    async createInviteLink(invite: Omit<InviteLink, 'id'>) {
      const { data, error } = await supabase.from('invite_links').insert(invite).select().single()
      if (error) throw error
      this.inviteLink = data
      return data
    }
  },

  persist: true
})
