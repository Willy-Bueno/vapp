import { defineStore } from "pinia"
import supabase from "@/lib/supabase"
import { generateToken } from "@/lib/token"
import { useCompanyStore } from "@/stores/company"

import { Tables } from "@/types"

type Company = Tables<"companies">

type InviteToken =
  | Tables<"invite_tokens">
  | (null & {
      companies: Company
    })
  | null

export const useInviteStore = defineStore("invite_token_store", {
  state: () => ({
    inviteToken: null as InviteToken | null,
  }),

  actions: {
    async getInviteToken() {
      const companyStore = useCompanyStore()
      if (companyStore.company === null) throw new Error("Company not found")

      const { data, error } = await supabase.from("invite_tokens").select("*").eq("company_id", companyStore.company.id)
      if (error) throw error

      if (!data || !data.length) {
        const { data: createdInviteData, error: createInviteError } = await supabase
          .from("invite_tokens")
          .insert({
            token: generateToken(),
            company_id: companyStore.company.id,
          })
          .select("*")
          .single()
        if (createInviteError) throw createInviteError

        this.inviteToken = createdInviteData
      } else {
        this.inviteToken = data[0]
      }
    },

    async getInviteTokenByToken(token: string) {
      const { data, error } = await supabase.from("invite_tokens").select("*, companies(*)").eq("token", token).single()
      if (error) throw error

      this.inviteToken = data
    },
  },
})
