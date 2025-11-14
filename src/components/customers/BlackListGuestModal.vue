<template>
  <div>
    <Modal v-if="isOpen" @close="emit('close')">
      <template #body>
        <div class="no-scrollbar relative w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8 border border-gray-200 dark:border-gray-700">
          <!-- Close button -->
          <button
            @click="emit('close')"
            class="transition-color absolute right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg
              class="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                fill=""
              />
            </svg>
          </button>

          <!-- Header -->
          <div class="px-2 pr-14 mb-6">
            <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ isBlacklisting ? $t('BlacklistGuest') : $t('UnblacklistGuest') }}
            </h4>
            <p class="text-sm text-gray-600 dark:text-white/70">
              {{ isBlacklisting
                  ? $t('blacklistGuestDescription', { name: guestDisplayName })
                  : $t('unblacklistGuestDescription', { name: guestDisplayName })
              }}
            </p>
          </div>

          <!-- Guest Info Card -->
          <div class="px-2 pr-14 mb-6">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <h5 class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ guestDisplayName }}
                  </h5>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ guestData?.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="px-2 pr-14">
            <!-- Reason Selection -->
            <div class="mb-6" v-if="isBlacklisting">
              <Select :lb="$t('blacklistReason')" :options="blacklistReasons" :placeholder="$t('please_select_reason')" :is-Loading="loading" :is-required="true"  v-model="blacklistReason"/>
              <!-- <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('blacklistReason') }} <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="blacklistReason"
                :placeholder="$t('customReasonPlaceholder')"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white resize-none"
                :class="{ 'border-red-500': errors.reason }"
              ></textarea>
              <p v-if="errors.reason" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.reason }}
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ $t('minimumCharacters', { count: 5 }) }}
              </p> -->
            </div>

            <!-- Warning message -->
            <div class="mb-6 p-4 rounded-md" :class="isBlacklisting ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'">
              <div class="flex">
                <component :is="isBlacklisting ? AlertTriangle : CheckCircle" class="flex-shrink-0 w-5 h-5 mt-0.5" :class="isBlacklisting ? 'text-red-400' : 'text-green-400'" />
                <div class="ml-3">
                  <h5 class="text-sm font-medium" :class="isBlacklisting ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'">
                    {{ isBlacklisting ? $t('blacklistWarningTitle') : $t('unblacklistConfirmationTitle') }}
                  </h5>
                  <p class="mt-1 text-sm" :class="isBlacklisting ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'">
                    {{ isBlacklisting ? $t('blacklistWarningMessage') : $t('unblacklistConfirmationMessage') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex justify-end space-x-4">
              <BasicButton
                :label="$t('Cancel')"
                variant="light"
                @click="emit('close')"
                :disabled="isLoading"
              />
               <BasicButton
                :label="isBlacklisting ? $t('BlacklistGuest') : $t('ConfirmUnblacklist')"
                :variant="isBlacklisting ? 'danger' : 'secondary'"
                type="submit"
                :loading="isLoading"
              />
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { watch } from 'vue'
import { CheckCircle, AlertTriangle } from 'lucide-vue-next'
import Select from '../forms/FormElements/Select.vue'
import { useServiceStore } from '@/composables/serviceStore'
import {
  getBlackListReasonsByHotel
} from '@/services/configrationApi'
import { useToast } from 'vue-toastification'

const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'))

const { t } = useI18n()
const serviceStore = useServiceStore()
const toast = useToast()


// --- PROPS ---
interface Props {
  isOpen: boolean;
  isLoading?: boolean;
  guestData?: any;
}
const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  guestData: null
});

// --- EMITS ---
const emit = defineEmits<{
  close: [];
  // Le payload inclut maintenant la raison, qui peut être vide
  confirm: [data: { reason?: string, blacklisted: boolean }];
}>();

// --- LOGIQUE ---
const blacklistReason = ref('');
const errors = ref({ reason: '' });
const blacklistReasons = ref([])
const loading = ref(false)


const isBlacklisting = computed(() => !props.guestData?.blacklisted);

const validateForm = (): boolean => {
  errors.value = { reason: '' };
  // La validation n'est requise que si on est en train de blacklister
  if (isBlacklisting.value) {
    if (!blacklistReason.value) {
      toast.error(t('validation.reasonRequired'));
      return false;
    }

  }
  return true;
};

const handleSubmit = () => {
  if (!validateForm()) return;

  emit('confirm', {
    reason: isBlacklisting.value ? blacklistReason.value.trim() : 'Retiré de la liste noire',
    blacklisted: isBlacklisting.value
  });
};

const resetForm = () => {
  blacklistReason.value = '';
  errors.value = { reason: '' };
};

watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});

const guestDisplayName = computed(() => {
  if (!props.guestData) return 'TThis guest';

  return props.guestData.displayName
      || props.guestData.fullName
      || `${props.guestData.firstName} ${props.guestData.lastName}`;
});

const fetchBlacklistReasons = async () => {
  try {
    loading.value = true
    const hotelId = serviceStore.serviceId
    const response = await getBlackListReasonsByHotel(hotelId!)
    console.log("response",response)
    blacklistReasons.value = response.data.data.data.map((r:any)=>{
      return{
        label:r.reason,
        value : r.reason
      }
    }) || []
  } catch (error) {
    console.error('Error fetching blacklist reasons:', error)
  } finally {
    loading.value = false
  }
}

onMounted(()=>{
  fetchBlacklistReasons()
})

</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
