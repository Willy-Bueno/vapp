<script setup lang="ts">
import { Toaster } from "vue-sonner"
import supabase from "@/lib/supabase"
import { useAuthStore } from "@/stores/auth"

supabase.auth.onAuthStateChange((event, session) => {
  const authStore = useAuthStore()

  switch (event) {
    case "SIGNED_IN":
      authStore.session = session
      break
    case "SIGNED_OUT":
      authStore.session = null
      break
  }
})
</script>

<template>
  <Toaster position="top-right" />
  <RouterView />
</template>
