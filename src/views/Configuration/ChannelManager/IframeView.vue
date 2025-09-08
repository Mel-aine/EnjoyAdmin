<template>
  <ChannelManagerLayout>
    <div class="">
      <div class="min-h-screen bg-gray-50">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">{{ t('loading.....') }}</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <div class="text-red-500 mb-4">
              <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('Error....') }}</h3>
            <p class="text-gray-600 mb-4">{{ error }}</p>
            <button @click="loadIframe"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              {{ t('Retry') }}
            </button>
          </div>
        </div>

        <!-- Iframe Loading State -->
        <div v-else-if="isIframeLoading" class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">{{ t('Loading iframe content...') }}</p>
          </div>
        </div>

        <!-- Iframe Content -->
        <div v-if="iframeUrl" class="h-screen">
          <iframe :src="iframeUrl" class="w-full h-full border-0" :title="t('Title')" @load="onIframeLoad"
            @error="onIframeError" allowfullscreen
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
        </div>
      </div>
    </div>
  </ChannelManagerLayout>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getIframUrl } from '@/services/channelManagerApi'
import { useToast } from 'vue-toastification'
import ChannelManagerLayout from '../../../components/layout/ChannelManagerLayout.vue'

const { t } = useI18n()
const toast = useToast()

const isLoading = ref(true)
const isIframeLoading = ref(false)
const error = ref<string | null>(null)
const iframeUrl = ref<string | null>(null)
const props = defineProps({
  page: {
    type: String,
    required: true
  }
})

const loadIframe = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response: any = await getIframUrl(props.page)
    console.log('response', response)
    if (response.data && response.data.success && response.data.data?.iframeUrl) {
      iframeUrl.value = response.data.data.iframeUrl
      isIframeLoading.value = true // Start iframe loading
    } else {
      throw new Error(t('channelManager.iframe.invalidResponse'))
    }
  } catch (err: any) {
    console.error('Error loading iframe URL:', err)
    error.value = err.response?.data?.message || err.message || t('channelManager.iframe.loadError')
    toast.error(error.value)
  } finally {
    isLoading.value = false
  }
}

const onIframeLoad = () => {
  isIframeLoading.value = false
  console.log('Iframe loaded successfully')
}

const onIframeError = () => {
  isIframeLoading.value = false
  error.value = t('channelManager.iframe.loadError')
  toast.error(error.value)
}

onMounted(() => {
  loadIframe()
})
</script>

<style scoped>
/* Ensure iframe takes full height */
iframe {
  min-height: 100vh;
}
</style>