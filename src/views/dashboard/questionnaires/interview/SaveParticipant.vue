<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'

  import "leaflet/dist/leaflet.css"
  import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet"

  import { cn } from '@/lib/utils'
  import * as z from 'zod'
  import { toast } from 'vue-sonner'

  import { useRouter } from 'vue-router'

  import { useParticipantStore } from '@/stores/participant'
  import { useParticipantToSurveyStore } from '@/stores/participantsToSurveys'

  import { Textarea } from '@/components/ui/textarea'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
  } from '@/components/ui/alert-dialog'

  import { Loader2 } from 'lucide-vue-next'
  import SwingPinIcon from '@/components/icons/SwingPinIcon.vue'


  import { Participant } from '@/models'

  const emit = defineEmits(['change-active-component'])

  const router = useRouter()

  const participantStore = useParticipantStore()
  const participantToSurveyStore = useParticipantToSurveyStore()

  const isLoading = ref(false)
  const marker = ref({ lat: 0, lng: 0 })
  const center = ref({ lat: 0, lng: 0 })
  const zoom = ref(13)

  watch(marker, (value) => {
    participantForm.value.lat = value.lat
    participantForm.value.lng = value.lng
  })

  const participantForm = ref<Omit<Participant, "id">>({
    first_name: '',
    last_name: '',
    address: '',
    lat: 0,
    lng: 0,
    complement: '',
    tags: ''
  })

  const participantSchema = z.object({
    first_name: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),
    last_name: z.string().min(3, { message: 'O sobrenome deve ter no mínimo 3 caracteres.' }),
    address: z.string().min(3, { message: 'O endereço deve ter no mínimo 3 caracteres.' }),
    lat: z.number().min(-90).max(90).refine((value) => value !== 0, { message: 'É necessário selecionar a localização do participante no mapa.' }),
    lng: z.number().min(-180).max(180).refine((value) => value !== 0, { message: 'É necessário selecionar a localização do participante no mapa.' }),
    complement: z.string().optional().nullable(),
    tags: z.string().optional().nullable(),
  })

  type ParticipantForm = z.infer<typeof participantSchema>
  const errors = ref<z.ZodFormattedError<ParticipantForm> | null>(null)

  function validate() {
    const result = participantSchema.safeParse(participantForm.value)
    if (!result.success) {
      errors.value = result.error.format()
      return false
    }
    return true
  }

  function handleSubmit() {
    isLoading.value = true

    const isValid = validate()
    if (!isValid) return

    const promise = () => new Promise(resolve => resolve(participantStore.createParticipant(participantForm.value).then((data) => {
      const surveyId = router.currentRoute.value.params.surveyId as string
      const participantId = data.id

      participantToSurveyStore.createParticipantToSurvey({
        participant: participantId,
        survey: surveyId,
        status: 'pending'
      }).then(() => {
        const interview = router.currentRoute.value.query.interview as string
        if (interview === 'on-site') {
          router.push({ name: 'save-response', params: { surveyId, participantId }, query: { interview } })
          return
        } else if (interview === 'remote-pre') {
          router.push({ name: 'share-link', params: { surveyId, participantId }, query: { interview } })
          return
        } else {
          router.push({ name: 'save-response', params: { surveyId, participantId }, query: { interview: 'remote' } })
          return
        }
      })
    })))

    toast.promise(promise, {
      loading: 'Cadastrando participante...',
      success: () => 'Participante cadastrado com sucesso!',
      error: () => 'Não foi possível cadastrar o participante.'
    })

    isLoading.value = false
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        center.value = {
          lat: position.coords.latitude, lng:
          position.coords.longitude
        }

        marker.value = {
          lat: position.coords.latitude, lng:
          position.coords.longitude
        }

        participantForm.value.lat = position.coords.latitude
        participantForm.value.lng = position.coords.longitude
      })
    } else {
      console.log("Geolocation is not supported by this browser.")
    }
  }

  onMounted(() => {
    getLocation()
  })
</script>

<template>
  <div class="flex flex-1 flex-col items-center px-6 py-36 space-y-16 ml-96">
    <div class="max-w-2xl w-full flex flex-col gap-2">
      <form class="space-y-8" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
          <Label for="first_name" :class="cn('text-sm', errors?.first_name && 'text-destructive')">
            Nome
          </Label>
          <Input name="first_name" v-model="participantForm.first_name" placeholder="Primeiro Nome" class="max-w-md" />
          <span class="text-muted-foreground text-sm">
            Informe o primeiro nome do participante.
          </span>
          <div v-if="errors?.first_name" class="text-sm text-destructive">
            <span v-for="error in errors.first_name._errors" :key="error">{{ error }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="last_name" :class="cn('text-sm', errors?.last_name && 'text-destructive')">
            Sobrenome
          </Label>
          <Input name="last_name" v-model="participantForm.last_name" placeholder="Sobrenome" class="max-w-md" />
          <span class="text-muted-foreground text-sm">
            Informe o sobrenome do participante.
          </span>
          <div v-if="errors?.last_name" class="text-sm text-destructive">
            <span v-for="error in errors.last_name._errors" :key="error">{{ error }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="address" :class="cn('text-sm', errors?.address && 'text-destructive')">
            Endereço
          </Label>
          <Input name="address" v-model="participantForm.address" placeholder="Endereço" />
          <span class="text-muted-foreground text-sm">
            Informe o endereço do participante.
          </span>
          <div v-if="errors?.address" class="text-sm text-destructive">
            <span v-for="error in errors.address._errors" :key="error">{{ error }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <Label :class="cn('text-sm', (errors?.lat || errors?.lng) && 'text-destructive')">
            Localização
          </Label>
          <AlertDialog>
            <AlertDialogTrigger class="w-fit">
              <Button variant="outline" type="button">
                <SwingPinIcon class="w-4 h-4 mr-2" />
                Selecionar localização
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent class="max-w-2xl w-full">
              <AlertDialogHeader>
                <AlertDialogTitle>Selecione sua localização</AlertDialogTitle>
                <AlertDialogDescription>
                  Arraste o icone até a localização da residência do participante.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div class="max-w-2xl w-full h-96 rounded-md overflow-hidden">
                <l-map ref="map" v-model:zoom="zoom" v-model:center="(center as any)" :useGlobalLeaflet="false">
                    <l-tile-layer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                        layer-type="base" name="Stadia Maps Basemap"></l-tile-layer>
                    <l-marker v-model:lat-lng.sync="marker" draggable></l-marker>
                </l-map>
              </div>
              <AlertDialogFooter>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <span class="text-muted-foreground text-sm">
            Clique no botão para selecionar a localização do participante. Essa localização será utilizada para identificar a residência do participante.
          </span>
          <div v-if="errors?.lat || errors?.lng" class="text-sm text-destructive">
            <span>É necessário selecionar a localização do participante no mapa.</span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="complement" class="text-sm">
            Complemento
            <span class="text-muted-foreground text-sm">
              (Opcional)
            </span>
          </Label>
          <Textarea name="complement" v-model="participantForm.complement" placeholder="Informe um complemento" />
          <span class="text-muted-foreground text-sm">
            O complemento ajuda a identificar a residência do participante com mais facilidade.
          </span>
        </div>
      </form>
    </div>
    <div class="max-w-2xl w-full flex gap-2 justify-start">
      <Button type="submit" @click="handleSubmit">
        <Loader2 v-if="isLoading" class="w-4 h4 mr-2" />
        Cadastrar Participante
      </Button>
    </div>
  </div>
</template>
