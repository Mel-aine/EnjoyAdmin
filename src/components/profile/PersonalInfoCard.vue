<template>
  <div>
    <!-- Section d’affichage des informations -->
    <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            {{ $t('personalInformation') }}
          </h4>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{ $t('FirstName') }}</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ firstname }}</p>
            </div>
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{ $t('LastName') }}</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ lastname }}</p>
            </div>
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{ $t('Email') }}</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ email }}</p>
            </div>
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{ $t('Phone') }}</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ phone }}</p>
            </div>
          </div>
        </div>

        <button type="button" @click="openModal" class="inline-flex dark:text-white">
          <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
            />
          </svg>
          {{ $t('edit') }}
        </button>
      </div>
    </div>

    <!-- Modal d’édition -->
    <Modal v-if="isProfileInfoModal" @close="isProfileInfoModal = false">
      <template #body>
        <div class="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <button
            @click="isProfileInfoModal = false"
            class="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-white/[0.07]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" class="fill-current">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
              />
            </svg>
          </button>

          <div class="px-2 pr-14">
            <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ $t('editPersonalInformation') }}
            </h4>
            <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
              {{ $t('updateInfo') }}
            </p>
          </div>

          <!-- Formulaire -->
          <form class="flex flex-col">
            <div class="custom-scrollbar h-[300px] overflow-y-auto p-2">
              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Input v-model="localFirstname" :lb="$t('FirstName')" :id="'first'" :forLabel="'first'"/>
                </div>

                <div>
                  <Input v-model="localLastname" :lb="$t('LastName')" :id="'firs'" :forLabel="'firs'" />
                </div>

                <div>
                  <Input v-model="localEmail" :lb="$t('Email')" :id="'fir'" :forLabel="'fir'"/>
                </div>

                <div>
                  <Input v-model="localPhone" :lb="$t('Phone')" :id="'phone'" :forLabel="'phone'" />
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <button
                @click="isProfileInfoModal = false"
                type="button"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 sm:w-auto"
              >
                {{ $t('Cancel') }}
              </button>
              <button
                @click="saveChanges"
                type="button"
                class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {{ $t('SaveChanges') }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import Modal from '@/components/profile/Modal.vue'
import Input from '../forms/FormElements/Input.vue'

const props = defineProps({
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
})

const emit = defineEmits(['updateProfile'])

const isProfileInfoModal = ref(false)

const localFirstname = ref('')
const localLastname = ref('')
const localEmail = ref('')
const localPhone = ref('')

const openModal = () => {
  localFirstname.value = props.firstname || ''
  localLastname.value = props.lastname || ''
  localEmail.value = props.email || ''
  localPhone.value = props.phone || ''
  isProfileInfoModal.value = true
}

const saveChanges = () => {
  emit('updateProfile', {
    firstname: localFirstname.value,
    lastname: localLastname.value,
    email: localEmail.value,
    phone: localPhone.value,
  })
  isProfileInfoModal.value = false
}
</script>

<!-- <style scoped>
.input {
  @apply h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30;
}
</style> -->
