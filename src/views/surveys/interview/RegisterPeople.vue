<script setup lang="ts">
import { ref, watch, onMounted } from "vue"

import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet"

import { cn } from "@/lib/utils"
import * as z from "zod"
import { toast } from "vue-sonner"

import { useRouter } from "vue-router"

import { useResponseStore } from "@/stores/response"
import { useCompanyStore } from "@/stores/company"
import { usePeopleStore } from "@/stores/people"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import SwingPinIcon from "@/components/icons/SwingPinIcon.vue"
import Loader from "@/components/icons/Loader.vue"

defineEmits(["change-active-component"])

const router = useRouter()

const responseStore = useResponseStore()
const companyStore = useCompanyStore()
const peopleStore = usePeopleStore()

const isSubmitting = ref(false)
const marker = ref({ lat: 0, lng: 0 })
const center = ref({ lat: 0, lng: 0 })
const latlng = ref()
const zoom = ref(13)

watch(marker, (value) => {
  respondentForm.value.lat = value.lat
  respondentForm.value.lng = value.lng
  latlng.value = `${value.lat}, ${value.lng}`
})

watch(latlng, (value) => {
  const [lat, lng] = value.split(",").map((v: string) => parseFloat(v.trim()))
  if (lat && lng) {
    if (lat !== marker.value.lat || lng !== marker.value.lng) {
      marker.value = { lat, lng }
    } else if (lat !== center.value.lat || lng !== center.value.lng) {
      center.value = { lat, lng }
    } else if (lat !== respondentForm.value.lat || lng !== respondentForm.value.lng) {
      respondentForm.value.lat = lat
      respondentForm.value.lng = lng
    }
  }
})

const respondentForm = ref({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  lat: 0,
  lng: 0,
  complement: "",
  company_id: "",
})

const participantSchema = z.object({
  first_name: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  last_name: z.string().min(3, { message: "O sobrenome deve ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "O email deve ser válido." }),
  phone: z.string().min(11, { message: "O telefone deve ter no mínimo 11 caracteres." }),
  address: z.string().min(3, { message: "O endereço deve ter no mínimo 3 caracteres." }),
  lat: z
    .number()
    .min(-90)
    .max(90)
    .refine((value) => value !== 0, { message: "É necessário selecionar a localização do participante no mapa." }),
  lng: z
    .number()
    .min(-180)
    .max(180)
    .refine((value) => value !== 0, { message: "É necessário selecionar a localização do participante no mapa." }),
  complement: z.string().optional().nullable(),
})

type ParticipantForm = z.infer<typeof participantSchema>
const errors = ref<z.ZodFormattedError<ParticipantForm> | null>(null)

function validate() {
  const result = participantSchema.safeParse(respondentForm.value)
  if (!result.success) {
    errors.value = result.error.format()
    return false
  }
  return true
}

function handleSubmit() {
  isSubmitting.value = true

  const isValid = validate()
  if (!isValid) {
    isSubmitting.value = false
    return
  }

  const promise = () =>
    new Promise((resolve) =>
      resolve(
        peopleStore.createPeople(respondentForm.value).then(({ id: peopleId }) => {
          const survey_id = router.currentRoute.value.params.id as string
          responseStore.createResponse({ people_id: peopleId, survey_id }).then((data) => {
            if (router.currentRoute.value.query.interview === "on-site") {
              router.push({ name: "register-response", params: { id: survey_id, responseId: data.id }, query: { interview: "on-site" } })
              return
            } else {
              router.push({ name: "share-link", params: { id: survey_id, responseId: data.id } })
            }
          })
        })
      )
    )

  toast.promise(promise, {
    loading: "Cadastrando participante...",
    success: () => {
      isSubmitting.value = false
      return "Participante cadastrado com sucesso!"
    },
    error: () => {
      isSubmitting.value = false
      return "Erro ao cadastrar participante!"
    },
  })
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      center.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      marker.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      respondentForm.value.lat = position.coords.latitude
      respondentForm.value.lng = position.coords.longitude
    })
  } else {
    console.log("Geolocation is not supported by this browser.")
  }
}

onMounted(async () => {
  const company = await companyStore.getCompany()
  respondentForm.value.company_id = company?.id as string
  getLocation()
})
</script>

<template>
  <div class="max-w-2xl w-full flex flex-col gap-2">
    <form class="space-y-8" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-2">
        <Label for="first_name" :class="cn('text-sm', errors?.first_name && 'text-destructive')"> Nome </Label>
        <Input name="first_name" v-model="respondentForm.first_name" placeholder="Primeiro Nome" class="max-w-md" />
        <span class="text-muted-foreground text-sm"> Informe o primeiro nome do participante. </span>
        <div v-if="errors?.first_name" class="text-sm text-destructive">
          <span v-for="error in errors.first_name._errors" :key="error">{{ error }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <Label for="last_name" :class="cn('text-sm', errors?.last_name && 'text-destructive')"> Sobrenome </Label>
        <Input name="last_name" v-model="respondentForm.last_name" placeholder="Sobrenome" class="max-w-md" />
        <span class="text-muted-foreground text-sm"> Informe o sobrenome do participante. </span>
        <div v-if="errors?.last_name" class="text-sm text-destructive">
          <span v-for="error in errors.last_name._errors" :key="error">{{ error }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <Label for="email" :class="cn('text-sm', errors?.email && 'text-destructive')"> Email </Label>
        <Input name="email" v-model="respondentForm.email" placeholder="Email" class="max-w-md" />
        <span class="text-muted-foreground text-sm"> Informe o email do participante. </span>
        <div v-if="errors?.email" class="text-sm text-destructive">
          <span v-for="error in errors.email._errors" :key="error">{{ error }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <Label for="phone" :class="cn('text-sm', errors?.phone && 'text-destructive')"> Telefone </Label>
        <Input name="phone" v-model="respondentForm.phone" placeholder="Telefone" class="max-w-md" />
        <span class="text-muted-foreground text-sm"> Informe o telefone do participante. </span>
        <div v-if="errors?.phone" class="text-sm text-destructive">
          <span v-for="error in errors.phone._errors" :key="error">{{ error }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <Label for="address" :class="cn('text-sm', errors?.address && 'text-destructive')"> Endereço </Label>
        <Input name="address" v-model="respondentForm.address" placeholder="Endereço" />
        <span class="text-muted-foreground text-sm"> Informe o endereço do participante. </span>
        <div v-if="errors?.address" class="text-sm text-destructive">
          <span v-for="error in errors.address._errors" :key="error">{{ error }}</span>
        </div>
      </div>

      <div class="flex flex-col space-y-2">
        <Label :class="cn('text-sm', (errors?.lat || errors?.lng) && 'text-destructive')"> Localização </Label>
        <div class="flex space-x-2">
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
                <AlertDialogDescription> Arraste o icone até a localização da residência do participante. </AlertDialogDescription>
              </AlertDialogHeader>
              <div class="max-w-2xl w-full h-96 rounded-md overflow-hidden">
                <l-map ref="map" :zoom="zoom" :center="center as any" :use-global-leaflet="false">
                  <l-tile-layer url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" layer-type="base" name="Stadia Maps Basemap"></l-tile-layer>
                  <l-marker :lat-lng.sync="marker" draggable></l-marker>
                </l-map>
              </div>
              <AlertDialogFooter>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Input v-model="latlng" placeholder="ex: -23.5505199, -46.6333094" class="flex-1" />
        </div>
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
          <span class="text-muted-foreground text-sm"> (Opcional) </span>
        </Label>
        <Textarea name="complement" v-model="respondentForm.complement" placeholder="Informe um complemento" />
        <span class="text-muted-foreground text-sm"> O complemento ajuda a identificar a residência do participante com mais facilidade. </span>
      </div>
    </form>
  </div>
  <div class="max-w-2xl w-full flex gap-2 justify-start">
    <Button type="submit" @click="handleSubmit">
      <Loader v-if="isSubmitting" class="w-4 h4 mr-2" />
      Cadastrar Participante
    </Button>
  </div>
</template>
