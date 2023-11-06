<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import CompanyForm from "@/views/welcome/register/CompanyForm.vue"
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle>Informações da empresa</CardTitle>
      <CardDescription>Precisamos de algumas informações de sua empresa</CardDescription>
    </CardHeader>
    <CardContent>
      <CompanyForm />
    </CardContent>
  </Card>
</template>
