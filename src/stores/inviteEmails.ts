import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

interface InviteEmail {
  id: string
  email: string
  invited_by: string
  business_id: string
  status: string | null
  role: string
}

export const useInviteEmailStore = defineStore('invite_email_store', {
  state: () => ({
    inviteEmail: null as InviteEmail | null
  }),

  actions: {
    async createInviteByEmail(invite: Omit<InviteEmail, 'id'>) {
      const { data, error } = await supabase.from('invite_emails').insert(invite).select().single()
      if (error) throw error
      this.inviteEmail = data
      return data
    }
  },

  persist: true
})
