<template>
  <div class="fixed inset-0 z-999 flex items-start hide-scrollbar justify-end">
    <div class="bg-white dark:bg-gray-800 shadow-lg w-[70%] max-w-4xl h-full mr-0 relative flex flex-col">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('supportTicket.title') }}</h2>
        <button class="text-gray-500 hover:text-red-500" @click="$emit('close')" :disabled="isSubmitting">
          <span class="sr-only">{{ $t('supportTicket.buttons.close') }}</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 overflow-hidden">
        <div class="grid grid-cols-12 gap-4 h-full">
          <!-- Form -->
          <div class="col-span-12 min-h-0 overflow-y-auto space-y-4">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Titre -->
              <FormInput v-model="title" :lb="t('supportTicket.fields.title')" :isRequired="true" :errorMsg="submitted && !title ? t('supportTicket.errors.required') : ''" :placeholder="t('supportTicket.placeholders.title')" />

              <!-- Catégorie / Module / Impact -->
              <div class="grid grid-cols-3 gap-4">
                <FormSelect v-model="category" :lb="t('supportTicket.fields.category')" :options="categoryOptions" />
                <FormSelect v-model="module" :lb="t('supportTicket.fields.module')" :options="moduleSelectOptions" />
                <FormSelect v-model="impact" :lb="t('supportTicket.fields.impact')" :options="impactOptions" />
              </div>

              <!-- Sévérité -->
              <RadioButtonGroup v-model="severityUi" :label="t('supportTicket.fields.severity')" :options="severityOptions" :isRequired="true" />

              <!-- Description complète -->
              <InputTextArea v-model="descriptionFull" :label="t('supportTicket.fields.descriptionFull')" :required="true" :errorMessage="submitted && !descriptionFull ? t('supportTicket.errors.required') : ''" :placeholder="t('supportTicket.placeholders.descriptionFull')" :rows="4" />

              <!-- Étapes / Attendu / Observé -->
              <InputTextArea v-model="steps" :label="t('supportTicket.fields.steps')" :required="true" :errorMessage="submitted && !steps ? t('supportTicket.errors.required') : ''" :rows="4" :placeholder="t('supportTicket.placeholders.steps')" />
              <div class="grid grid-cols-2 gap-4">
                <FormInput v-model="expected" :lb="t('supportTicket.fields.expected')" :isRequired="true" :errorMsg="submitted && !expected ? t('supportTicket.errors.required') : ''" :placeholder="t('supportTicket.placeholders.expected')" />
                <FormInput v-model="actual" :lb="t('supportTicket.fields.actual')" :isRequired="true" :errorMsg="submitted && !actual ? t('supportTicket.errors.required') : ''" :placeholder="t('supportTicket.placeholders.actual')" />
              </div>

              <!-- Contexte manuel -->
              <div class="grid grid-cols-2 gap-4">
                <FormInput v-model="entityId" :lb="t('supportTicket.fields.entityId')" :placeholder="t('supportTicket.placeholders.entityId')" />
                <FormInput v-if="severityUi === 'blocking'" v-model="callbackPhone" :lb="t('supportTicket.fields.callbackPhone')" inputType="tel" :placeholder="t('supportTicket.placeholders.callbackPhone')" />
              </div>

              <!-- Pièce jointe -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('supportTicket.fields.attachment') }}</label>
                <input type="file" accept="image/*" @change="onFileChange" class="mt-1 w-full text-sm" />
              </div>

              <!-- URL enregistrement session: capturée automatiquement et non affichée -->

              <!-- Submit -->
              <div class="flex items-center gap-2">
                <button type="submit" class="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
                        :disabled="isSubmitting">
                  {{ isSubmitting ? t('supportTicket.buttons.submitting') : t('supportTicket.buttons.submit') }}
                </button>
                <span v-if="submitMessage" class="text-sm" :class="submitError ? 'text-red-600' : 'text-green-600'">{{ submitMessage }}</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '@/composables/serviceStore'
import { createSupportTicket } from '@/services/api'
import { useRoute } from 'vue-router'
import FormInput from '@/components/forms/FormElements/Input.vue'
import FormSelect from '@/components/forms/FormElements/Select.vue'
import InputTextArea from '@/components/forms/FormElements/InputTextArea.vue'
import RadioButtonGroup from '@/components/forms/FormElements/RadioButtonGroup.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const serviceStore = useServiceStore()

const title = ref('')
const category = ref<'bug' | 'suggestion' | 'question'>('bug')
// UI severity mapped to API severity
const severityUi = ref<'blocking' | 'major' | 'minor'>('major')
const steps = ref('')
const expected = ref('')
const actual = ref('')
const descriptionFull = ref('')
const impact = ref<'tous' | 'plusieurs' | 'un' | 'rapport'>('un')
const entityId = ref('')
const callbackPhone = ref('')
const sessionRecordingUrl = ref('')
const module = ref('Autre')
const moduleOptions = [
  'Réservations',
  'Check-in/out',
  'Facturation',
  'Housekeeping',
  'Moteur de réservation',
  'Rapports',
  'Autre',
]
const moduleLabelKeyMap: Record<string, string> = {
  'Réservations': 'reservations',
  'Check-in/out': 'checkin',
  'Facturation': 'billing',
  'Housekeeping': 'housekeeping',
  'Moteur de réservation': 'bookingEngine',
  'Rapports': 'reports',
  'Autre': 'other',
}
const categoryOptions = computed(() => [
  { label: t('supportTicket.options.category.bug'), value: 'bug' },
  { label: t('supportTicket.options.category.suggestion'), value: 'suggestion' },
  { label: t('supportTicket.options.category.question'), value: 'question' },
])
const impactOptions = computed(() => [
  { label: t('supportTicket.options.impact.tous'), value: 'tous' },
  { label: t('supportTicket.options.impact.plusieurs'), value: 'plusieurs' },
  { label: t('supportTicket.options.impact.un'), value: 'un' },
  { label: t('supportTicket.options.impact.rapport'), value: 'rapport' },
])
const severityOptions = computed(() => [
  { label: t('supportTicket.options.severity.blocking'), value: 'blocking' },
  { label: t('supportTicket.options.severity.major'), value: 'major' },
  { label: t('supportTicket.options.severity.minor'), value: 'minor' },
])
const moduleSelectOptions = computed(() => moduleOptions.map((m) => ({ label: t(`supportTicket.options.module.${moduleLabelKeyMap[m]}`), value: m })))
const attachment = ref<File | null>(null)

const submitted = ref(false)
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitError = ref(false)

const pageUrl = computed(() => {
  try {
    // Build a fully-qualified URL using origin + current route
    return new URL(window.location.origin + route.fullPath).toString()
  } catch {
    // Fallback to location href
    return window.location.href
  }
})
const userAgent = computed(() => navigator.userAgent)
const userId = computed(() => authStore.UserId || authStore.user?.id || null)
const hotelId = computed(() => serviceStore.serviceId)
const hotelName = computed(() => serviceStore.getCurrentService?.hotelName || null)
const pmsVersion = computed(() => import.meta.env?.VITE_APP_VERSION || null)
const route = useRoute()

// Préremplissage module suivant la route
const mapRouteToModule = (path: string) => {
  const p = path.toLowerCase()
  if (p.includes('cashiering') || p.includes('payment') || p.includes('invoice')) return 'Facturation'
  if (p.includes('reservation') || p.includes('booking')) return 'Réservations'
  if (p.includes('checkin') || p.includes('check-out')) return 'Check-in/out'
  if (p.includes('housekeeping')) return 'Housekeeping'
  if (p.includes('report')) return 'Rapports'
  if (p.includes('ota') || p.includes('engine')) return 'Moteur de réservation'
  return 'Autre'
}
module.value = mapRouteToModule(route.path)

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  attachment.value = input.files && input.files.length ? input.files[0] : null
}

// Capture automatique de l'URL d'enregistrement de session (si un provider est présent)
const autoCaptureSessionRecordingUrl = () => {
  try {
    const w = window as any
    // LogRocket
    if (w.LogRocket && typeof w.LogRocket.getSessionURL === 'function') {
      w.LogRocket.getSessionURL((url: string) => {
        if (url) sessionRecordingUrl.value = url
      })
      return
    }
    // FullStory
    if (w.FS && typeof w.FS.getCurrentSessionURL === 'function') {
      const url = w.FS.getCurrentSessionURL()
      if (url) sessionRecordingUrl.value = url
      return
    }
    // Ajoutez ici d'autres providers si nécessaire
  } catch {
    // Ignorer les erreurs de détection
  }
}

onMounted(() => {
  autoCaptureSessionRecordingUrl()
})

const handleSubmit = async () => {
  submitted.value = true
  submitMessage.value = ''
  submitError.value = false

  // Normalize steps to array for backend validation
  const stepsArray = steps.value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  if (!title.value || !descriptionFull.value || stepsArray.length === 0 || !expected.value || !actual.value) {
    submitMessage.value = t('supportTicket.errors.requiredFields')
    submitError.value = true
    return
  }

  const severity = severityUi.value === 'blocking' ? 'critical' : severityUi.value === 'major' ? 'high' : 'low'
  const payload = {
    title: title.value,
    category: category.value,
    module: module.value,
    impact: impact.value,
    severity,
    description: {
      full: descriptionFull.value,
      steps: stepsArray,
      expected: expected.value,
      actual: actual.value,
    },
    context: {
      pageUrl: pageUrl.value,
      userAgent: userAgent.value,
      userId: userId.value,
      hotelId: hotelId.value,
      hotelName: hotelName.value,
      pmsVersion: pmsVersion.value,
      entityId: entityId.value || null,
      sessionRecordingUrl: sessionRecordingUrl.value || null,
      callbackPhone: severityUi.value === 'blocking' ? (callbackPhone.value || null) : null,
    },
  }

  try {
    isSubmitting.value = true
    await createSupportTicket(payload, attachment.value || undefined)
    submitMessage.value = t('supportTicket.errors.submitSuccess')
    submitError.value = false
    setTimeout(() => {
      isSubmitting.value = false
      // reset simple fields
      title.value = ''
      steps.value = ''
      expected.value = ''
      actual.value = ''
      attachment.value = null
      // close modal
      // petite temporisation pour laisser afficher le succès
      ;(emit as any)('close')
    }, 800)
  } catch (err) {
    console.error('Erreur envoi ticket support', err)
    submitMessage.value = t('supportTicket.errors.submitFail')
    submitError.value = true
  } finally {
    isSubmitting.value = false
  }
}

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.z-999 { z-index: 999; }
</style>