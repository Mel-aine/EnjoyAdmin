
<template>
  <div class="general-settings">
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">{{ t('GeneralSettings') }}</h2>
      <p class="text-gray-600 mb-6 dark:text-white">{{ t('manage...') }}</p>
    </div>

    <div class="space-y-6">
      <!-- Profile Information -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 dark:bg-gray-950 dark:text-white">
        <h3 class="text-lg font-medium mb-3">{{ t('ProfileInformation') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input :lb="$t('FirstName')" v-model="profileData.firstName" :id="'fullname'" :forLabel="'fullname'"/>
          </div>
          <div>
            <Input :lb="$t('LastName')" v-model="profileData.lastName" :id="'name'" :forLabel="'name'"/>
          </div>
          <div>
            <Input :lb="$t('Email')" v-model="profileData.email" :inputType="'email'" :id="'email'" :forLabel="'email'"/>
          </div>
          <div>
            <Input :lb="$t('Phone')" v-model="profileData.phone" :inputType="'tel'" :id="'em'" :forLabel="'em'"/>
          </div>
        </div>
      </div>
<!-- Buttons -->
      <div class="flex justify-end space-x-3 py-4">
        <button
          @click="resetForm"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          {{ t('Cancel') }}
        </button>
        <button
          @click="saveChanges"
          class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
        >

          <span v-if="!isLoading">  {{ t('SaveChanges') }} </span>
          <span v-else class="flex items-center gap-2">
            <Spinner class="w-4 h-4" />
            {{ $t('Processing') }}...
          </span>
        </button>
      </div>



      <!-- Preferences -->
      <div class="bg-gray-50 p-5 mb-4 rounded-lg border border-gray-200 dark:bg-gray-950 dark:text-white">
        <h3 class="text-lg font-medium mb-3">{{ t('Preferences') }}</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium">{{ t('Language') }}</h4>
              <p class="text-xs text-gray-500">{{ t('Selectyourpreferredlanguage') }}</p>
            </div>
              <ButtonLanguage></ButtonLanguage>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium">{{ t('Timezone') }}</h4>
              <p class="text-xs text-gray-500">{{ t('Setyourlocaltimezone') }}</p>
            </div>
            <div class="w-64">
            <Select :options="timezones"  v-model="preferences.timezone"/>
            </div>
          </div>

          <div class="flex items-center justify-between pt-8 mt-10 ">
            <div>
              <h4 class="text-sm font-medium">{{ t('darkMode') }}</h4>
              <p class="text-xs text-gray-500">{{ t('enabledarktheme') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="preferences.darkMode" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between pt-2">
            <div>
              <h4 class="text-sm font-medium">{{ t('emailNotifications') }}</h4>
              <p class="text-xs text-gray-500">{{ t('receiveemailnotifications') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="preferences.emailNotifications" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,computed,defineAsyncComponent,onMounted } from 'vue';
import { useTheme } from '@/components/layout/ThemeProvider.vue'


const { toggleTheme }: any = useTheme()

import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/composables/user'
import {updateUser,getUserId} from '@/services/api'
import { useToast } from 'vue-toastification'
import { watch } from 'vue'

const { t } = useI18n();
const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'));
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'));
const Spinner = defineAsyncComponent(() => import('@/components/spinner/Spinner.vue'));
const ButtonLanguage = defineAsyncComponent(() => import('@/components/buttons/ButtonLanguage.vue'));
const authStore = useAuthStore()
const isLoading = ref(false)
const toast = useToast()


const Firstname = computed(() => {
  // const userData = authStore.user
  const user = authStore.user;
  return `${user?.firstName ?? ''}`
})
const LastName = computed(() => {
  // const userData = authStore.user
  const user = authStore.user;
  return `${user?.lastName ?? ''}`
})
const Email = computed(() => {
  // const userData = authStore.user
  const user = authStore.user;
  return `${user?.email ?? ''}`
})

const Phone = computed(() => {
  // const userData = authStore.user
  const user = authStore.user;
  return `${user?.phoneNumber ?? ''}`
})





const profileData = ref({
  firstName: Firstname.value,
  lastName: LastName.value,
  email: Email.value,
  phone: Phone.value
})


watch(() => authStore.user, (newUserRaw:any) => {
  const user = JSON.parse(newUserRaw || '{}');
  profileData.value.firstName = user.firstName || '';
  profileData.value.lastName = user.lastName || '';
  profileData.value.email = user.email || '';
  profileData.value.phone = user.phoneNumber || '';
}, { immediate: true });


watch(profileData, (newProfile:any) => {
  const user = JSON.parse(authStore.user || '{}');
  user.firstName = newProfile.firstName;
  user.lastName = newProfile.lastName;
  user.email = newProfile.email;
  user.phoneNumber = newProfile.phone;

  authStore.user = JSON.stringify(user);
}, { deep: true });

// User preferences
const preferences = ref({
  language: 'en',
  timezone: 'UTC',
  darkMode: false,
  emailNotifications: true
});

watch(() => preferences.value.darkMode, (isDark:boolean) => {
  toggleTheme(isDark ? 'dark' : 'light')
})
// Save form data
const saveChanges = async() => {
  const id = authStore.UserId
  isLoading.value = true;

  try {
    const payload = {
      first_name : profileData.value.firstName,
      last_name : profileData.value.lastName,
      email : profileData.value.email,
      phone_number : profileData.value.phone
    }
    console.log("eee",payload)
    const response = await updateUser(id,payload)
    console.log('response:', response);
    toast.success(t('toast.userUpdatedSuccess'));
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    toast.error(t('toast.updateError'));
  }finally{
    isLoading.value = false;
  }
};

onMounted(async () => {
  const id = authStore.UserId;

  await getUserId(id);
  const user = JSON.parse(authStore.user || '{}');
          console.log("eeee",user)
  profileData.value = {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phoneNumber || ''
  };
});

// Reset form to initial values
const resetForm = () => {
  // profileData.value = {
  //   firstName: 'John Doe',
  //   lastName: 'John Doe',
  //   email: 'john.doe@example.com',
  //   phone: '+1 (555) 123-4567'
  // };

  preferences.value = {
    language: 'en',
    timezone: 'UTC',
    darkMode: false,
    emailNotifications: true
  };
};
const timezones = computed(() => [
  { value: 'UTC', label: t('timezones.utc') },
  { value: 'America/New_York', label: t('timezones.et') },
  { value: 'America/Chicago', label: t('timezones.ct') },
  { value: 'America/Denver', label: t('timezones.mt') },
  { value: 'America/Los_Angeles', label: t('timezones.pt') },
  { value: 'Europe/Paris', label: t('timezones.cet') },
])
</script>
