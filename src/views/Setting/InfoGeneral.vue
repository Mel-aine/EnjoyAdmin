<template>
  <div class="mb-8 bg-white rounded-lg p-6 max-w-full mx-auto shadow-lg">
    <h3 class="text-xl font-semibold text-gray-700 mb-4">{{ $t('generalInfo') }}</h3>

    <div class="mb-4">
      <Input
        :lb="t('hotelName')"
        :id="'hotelName'"
        :forLabel="'hotelName'"
        v-model="formData.name"
      />
    </div>

    <div class="space-y-4 mb-8">
      <label
        for="hotelAddress"
        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
      >
        {{ t('hotelAddress') }}
      </label>

      <input
        ref="autocompleteInput"
        type="text"
        id="hotelAddress"
        v-model="formData.address.text"
        :placeholder="t('hotelAddress')"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
      />

      <div ref="mapRef" class="w-full h-64 rounded shadow-md" />

      <div v-if="formData.address.text" class="text-sm text-gray-700 mt-2">
        ✅ {{ formData.address.text }} <br />
        📍 Lat: {{ formData.address.lat }}, Lng: {{ formData.address.lng }}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="mb-4">
        <Select :lb="t('Numberofstars')" :options="stars" />
      </div>

      <div class="mb-4">
        <Input
          :lb="t('hotelPhone')"
          :id="'hotelPhone'"
          :forLabel="'hotelPhone'"
          :inputType="'tel'"
          v-model="formData.phone"
        />
      </div>

      <div class="mb-4">
        <Input
          :lb="t('hotelEmail')"
          :id="'hotelEmail'"
          :forLabel="'hotelEmail'"
          :inputType="'email'"
          v-model="formData.email"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference types="@types/google.maps" />

import { ref, onMounted, defineAsyncComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))

const { t } = useI18n()

interface Props {
  modelValue: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  // maxImages: 10,
  // maxFileSize: 10
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

const formData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const stars = ref([
  { value: 1, label: '1 étoile' },
  { value: 2, label: '2 étoiles' },
  { value: 3, label: '3 étoiles' },
  { value: 4, label: '4 étoiles' },
  { value: 5, label: '5 étoiles' },
])

//address map

const autocompleteInput = ref<HTMLInputElement | null>(null)
const mapRef = ref<HTMLDivElement | null>(null)

// Charge Google Maps API
const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).google) return resolve()
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject('Google Maps failed to load')
    document.head.appendChild(script)
  })
}

let map: google.maps.Map
let marker: google.maps.Marker | null = null

onMounted(async () => {
  await loadGoogleMapsScript()
  if (!window.google || !mapRef.value || !autocompleteInput.value) return

  // Init carte
  map = new google.maps.Map(mapRef.value, {
    center: { lat: 3.87, lng: 11.54 },
    zoom: 12,
  })

  // Autocomplete Google Places
  const autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value, {
    types: ['(cities)'],
    componentRestrictions: { country: 'cm' },
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (!place.geometry || !place.geometry.location) return

    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()

    // address.value = {
    //   text: place.formatted_address || '',
    //   lat,
    //   lng,
    // }
    formData.value.address = {
      text: place.formatted_address || '',
      lat,
      lng,
    }

    map.setCenter({ lat, lng })
    map.setZoom(13)
    setMarker(lat, lng)
  })

  // Clic sur la carte
  map.addListener('click', (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat()
    const lng = e.latLng?.lng()
    if (!lat || !lng) return

    formData.value.address = {
      text: '📍 Position personnalisée',
      lat,
      lng,
    }
    setMarker(lat, lng)
  })
})

// Ajoute ou déplace le marqueur
const setMarker = (lat: number, lng: number) => {
  if (!marker) {
    marker = new google.maps.Marker({ position: { lat, lng }, map })
  } else {
    marker.setPosition({ lat, lng })
  }
}

console.log('formData', formData)
</script>
