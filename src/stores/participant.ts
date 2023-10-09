import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Participant } from '@/models'

export const useParticipantStore = defineStore('participant_store', {
  state: () => ({
    participant: null as Participant | null,
  }),

  actions: {
    async createParticipant(participant: Omit<Participant, 'id'>) {
      const { data, error } = await supabase.from('participants').insert(participant).select('*').single()
      if (error) throw error
      this.participant = data as unknown as Participant
      return data
    }
  },

  persist: true
})
