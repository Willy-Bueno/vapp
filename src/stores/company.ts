import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Tables, Insert, Update } from '@/types'

type Company = Tables<'companies'> | null & {
  users: Tables<'users'>[],
  people: Tables<'people'>[],
}

export const useCompanyStore = defineStore('company_store', {
  state: () => ({
    company: null as Company | null
  }),

  actions: {
    async getCompany() {
      const { data: { user }, error: getUserError } = await supabase.auth.getUser()
      if (getUserError) throw getUserError
      if (user === null) throw new Error('User not found')

      const { data, error: getCompanyIdError } = await supabase.from('users').select('company_id').eq('id', user.id).single()
      if (getCompanyIdError) throw getCompanyIdError
      if (data.company_id === null) {
        this.company = null
        return
      }

      const { data: company_data, error } = await supabase.from('companies').select('*, users(*), people(*)').eq('id', data.company_id).single()
      if (error) throw error
      this.company = company_data

      return company_data
    },

    async createCompany(company: Insert<'companies'>) {
      const { data, error } = await supabase.from('companies').insert(company).select('*').single()
      if (error) throw error

      const { data: { user }, error: getUserError } = await supabase.auth.getUser()
      if (getUserError) throw getUserError
      if (user === null) throw new Error('User not found')

      const { error: updateUserError } = await supabase.from('users').update({ company_id: data.id }).eq('id', user.id).select()
      if (updateUserError) throw updateUserError

      this.company = data
    },

    async updateCompany(company: Update<'companies'>) {
      if (this.company === null) throw new Error('Company not found')
      const { error } = await supabase.from('companies').update(company).eq('id', this.company.id).select()
      if (error) throw error
    }
  }
})
