<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import InviteForm from "@/views/welcome/invite/InviteForm.vue"
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle>Convite de equipe</CardTitle>
      <CardDescription>Você foi convidado a participar de uma empresa.</CardDescription>
    </CardHeader>
    <CardContent>
      <InviteForm />
    </CardContent>
  </Card>
</template>
