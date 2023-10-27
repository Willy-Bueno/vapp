<script setup lang="ts">
  import CheckIcon from '@/components/icons/CheckIcon.vue'
</script>

<template>
  <div class="relative z-10 h-fit w-full max-w-xl overflow-hidden border border-gray-100 sm:rounded-2xl sm:shadow-xl">
    <div class="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
      <div class="w-16 h-16 flex justify-center items-center rounded-full border shadow dark:bg-zinc-900 dark:border-none dark:shadow-none">
        <CheckIcon class="w-8 h-8 text-success" />
      </div>
      <h3 class="text-xl font-semibold">Verifique seu email</h3>
      <p v-if="$route.query.type === 'register'" class="text-sm text-gray-500">Enviamos um email para <strong>{{ $route.query.email }}</strong> com um link para finalizar seu cadastro.</p>
      <p v-if="$route.query.type === 'recovery'" class="text-sm text-gray-500">Enviamos um email para <strong>{{ $route.query.email }}</strong> com um link para acessar sua conta.</p>
    </div>
  </div>
</template>
