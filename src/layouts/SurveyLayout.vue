<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'

  import { useRouter } from 'vue-router'

  import { useSurveyStore } from '@/stores/survey'
  import { useAuthStore } from '@/stores/auth'

  import { Skeleton } from '@/components/ui/skeleton'
  import { Button } from '@/components/ui/button'

  import VappLogo from '@/components/icons/VappLogo.vue'
  import HomeIcon from '@/components/icons/HomeIcon.vue'

  import ThemeSwitcher from '@/components/header/ThemeSwitcher.vue'

  const router = useRouter()

  const surveyStore = useSurveyStore()
  const authStore = useAuthStore()

  const survey = computed(() => surveyStore.survey)

  const isLoading = ref(false)

  onMounted(async () => {
    isLoading.value = true
    const surveyId = router.currentRoute.value.params.id as string
    if (surveyId) await surveyStore.getSurvey(surveyId)
    isLoading.value = false
  })
</script>

<template>
  <div class="min-h-screen h-full flex flex-col lg:flex-row">
    <div class="hidden lg:flex fixed min-h-screen h-full w-96 border-r p-4 flex-col space-y-16">
      <div class="flex flex-1 justify-start p-4">
        <Button v-if="authStore.isAuthenticated" type="button" variant="outline" class="flex items-center mr-2" @click="() => router.push({ name: 'surveys' })">
          <HomeIcon class="h-4 w-4 text-muted-foreground" />
        </Button>
        <ThemeSwitcher />
      </div>
      <div class="flex flex-col justify-between h-full">
        <div v-if="isLoading" class="w-full h-fit flex flex-col justify-center items-start p-4 space-y-4">
          <div class="flex items-center justify-start">
            <Skeleton class="w-6 h-6 mr-2 rounded-full" />
            <Skeleton class="w-24 h-6" />
          </div>
          <div class="flex flex-col space-y-4">
            <Skeleton class="w-80 h-8" />
            <Skeleton class="w-52 h-8" />
            <Skeleton class="w-44 h-8" />
          </div>
        </div>
        <div v-else class="w-full h-fit flex flex-col justify-center items-start p-4 space-y-4">
          <div class="flex items-center justify-start">
            <VappLogo class="w-4 h-4 mr-2" />
            Franet Telecom
          </div>
          <h1 class="font-bold text-3xl">{{ survey?.title }}</h1>
        </div>
        <span class="flex justify-start items-center text-muted-foreground px-4">criado com <VappLogo class="w-4 h-4 ml-2 mr-1" /> Vendas App</span>
      </div>
    </div>
    <div class="lg:hidden flex w-full p-4 border-b">
      <div class="flex flex-1 flex-col gap-4 justify-center">
        <div class="flex gap-2">
          <Button v-if="authStore.isAuthenticated" type="button" variant="outline" class="flex items-center" @click="() => router.push({ name: 'surveys' })">
            <HomeIcon class="h-4 w-4 text-muted-foreground" />
          </Button>
          <ThemeSwitcher />
        </div>
        <div class="flex flex-col justify-between h-full mx-auto">
          <div v-if="isLoading" class="w-full h-fit flex flex-col justify-center items-start space-y-4">
            <div class="flex items-center justify-start">
              <Skeleton class="w-6 h-6 mr-2 rounded-full" />
              <Skeleton class="w-24 h-6" />
            </div>
            <div class="flex flex-col space-y-4">
              <Skeleton class="w-80 h-8" />
              <Skeleton class="w-52 h-8" />
              <Skeleton class="w-44 h-8" />
            </div>
          </div>
          <div v-else class="w-full h-fit flex flex-col justify-center items-start space-y-4">
            <div class="flex items-center justify-start">
              <VappLogo class="w-4 h-4 mr-2" />
              Franet Telecom
            </div>
            <h1 class="font-bold text-3xl">{{ survey?.title }}</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-1 flex-col items-center px-4 md:px-8 py-36 space-y-16 lg:mt-32 lg:ml-96">
      <RouterView />
    </div>
  </div>
</template>
