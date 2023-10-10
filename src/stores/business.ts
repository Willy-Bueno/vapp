import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Business } from '@/models'

export const useBusinessStore = defineStore('business_store', {
  state: () => ({
    business: null as Business | null,
  }),

  actions: {
    async getBusinessById(id: string) {
      const { data, error } = await supabase.from('business').select('*').eq('id', id).single()
      if (error) throw error
      this.business = data
    },

    async createBusiness(payload: Omit<Business, 'id'>) {
      const { data, error } = await supabase.from('business').insert(payload).select().single()
      if (error) throw error
      this.business = data
      return data
    },

    async updateBusiness(payload: Partial<Business>) {
      const { data, error } = await supabase.from('business').update(payload).eq('id', payload.id!).select().single()
      if (error) throw error
      this.business = data
    }
  }
})
