<script setup lang="ts">
  import CheckIcon from '@/components/icons/CheckIcon.vue'
</script>

<template>
  <div class="max-w-2xl w-full h-full flex flex-col gap-2 justify-center items-center space-y-6">
    <div class="w-16 h-16 flex justify-center items-center rounded-full border shadow dark:bg-zinc-900 dark:border-none dark:shadow-none">
      <CheckIcon class="w-8 h-8 text-success" />
    </div>
    <div class="flex flex-col justify-center items-center max-w-md">
      <h1 class="text-2xl font-bold text-center">Obrigado!</h1>
      <span class="text-muted-foreground text-sm text-center">
        Obrigado por responder a pesquisa, sua resposta é muito importante para nós.
      </span>
    </div>
  </div>
</template>
