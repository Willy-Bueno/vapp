<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'

import BusinessForm from '@/views/start/register/BusinessForm.vue'

</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle>Informações da empresa</CardTitle>
      <CardDescription>Precisamos de algumas informações de sua empresa</CardDescription>
    </CardHeader>
    <CardContent>
      <BusinessForm />
    </CardContent>
  </Card>
</template>
