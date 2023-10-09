<script setup lang="ts">
  import { toast } from 'vue-sonner'

  import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  } from '@/components/ui/sheet'
  import {
    Card,
    CardContent,
  } from '@/components/ui/card'


  import { Survey } from '@/models'

  const props = defineProps<{ survey: Survey }>()

  function copyLink (surveyId: string) {
    const link = `${window.location.origin}/ask/participant/${surveyId}`

    navigator.clipboard.writeText(link)

    toast.success('Link copiado com sucesso!')
  }
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Card>
        <CardContent class="flex flex-1 p-6 hover:cursor-pointer">
          <div class="space-y-8">
            <div>
              <h1 class="text-lg font-bold">{{ props.survey.title }}</h1>
              <p class="text-sm text-muted-foreground">{{ props.survey.description }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Selecione uma opção de entrvista.</SheetTitle>
        <SheetDescription>
          Escolha a opção de entrevista que você deseja realizar.
        </SheetDescription>
      </SheetHeader>
      <div class="grid space-y-4 mt-4">
        <Card>
          <CardContent class="flex flex-1 p-6 hover:cursor-pointer" @click="() => $router.push({ name: 'save-participant', params: { surveyId: props.survey.id }, query: { interview: 'on-site' } })">
            <div class="space-y-8">
              <div>
                <h1 class="text-lg font-bold">Entrevista presencial.</h1>
                <p class="text-sm text-muted-foreground">O entrvistador cadastra o participante e realiza a entrevista presencialmente.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="flex flex-1 p-6 hover:cursor-pointer" @click="() => $router.push({ name: 'save-participant', params: { surveyId: props.survey.id }, query: { interview: 'remote-pre' } })">
            <div class="space-y-8">
              <div>
                <h1 class="text-lg font-bold">Entrevista remota com participante já cadastrado.</h1>
                <p class="text-sm text-muted-foreground">O entrvistador cadastra o participante e compartilha o link para que ele responda a pesquisa.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="flex flex-1 p-6 hover:cursor-pointer" @click="copyLink(survey.id)">
            <div class="space-y-8">
              <div>
                <h1 class="text-lg font-bold">Entrevista totalmente remota.<span class="text-sm text-muted-foreground">(Clique para copiar o link)</span></h1>
                <p class="text-sm text-muted-foreground">O entrvistador compartilha o link e o participante cadastra suas informações e responde a pesquisa.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SheetContent>
  </Sheet>
</template>
