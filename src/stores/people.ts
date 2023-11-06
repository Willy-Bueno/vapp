import { defineStore } from "pinia"
import supabase from "@/lib/supabase"
import { useCompanyStore } from "@/stores/company"

import { Tables, Insert } from "@/types"

export const usePeopleStore = defineStore("people_store", {
  state: () => ({
    peoples: null as Tables<"people">[] | null,
    people: null as Tables<"people"> | null,
  }),

  actions: {
    async getPeoples() {
      const companyStore = useCompanyStore()
      const company = await companyStore.getCompany()
      if (!company) throw new Error("Company not found")

      const { data, error } = await supabase.from("people").select("*").eq("company_id", company.id)
      if (error) throw error

      this.peoples = data

      return data
    },

    async createPeople(respondent: Insert<"people">) {
      const { data, error } = await supabase.from("people").insert(respondent).select("*").single()
      if (error) throw error
      this.people = data
      return data
    },
  },
})
