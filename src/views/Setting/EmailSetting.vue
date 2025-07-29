<template>
  <div class="email-settings">
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">{{ t('EmailSettings') }}</h2>
      <p class="text-gray-600 mb-6">{{ t('manageryour...') }}</p>
    </div>

    <div class="space-y-6">
      <!-- Email Address Configuration -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 dark:bg-gray-950 dark:text-white">
        <h3 class="text-lg font-medium mb-3">{{ t('EmailAddresses') }}</h3>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('PrimaryEmail') }}</label>
          <div class="relative lg:flex gap-2  ">
            <div class="w-full">
              <Input v-model="primaryEmail" :inputType="'email'" :disabled="!editingPrimary" />
            </div>
            <button @click="toggleEditPrimary"
              class="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 dark:bg-gray-950 dark:text-white">
              {{ editingPrimary ? t('Cancel') : t('edit') }}
            </button>
            <button v-if="editingPrimary" @click="savePrimaryEmail"
              class="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
              {{ t('Save') }}
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">{{ t('thisemail') }}</p>
        </div>

        <h4 class="text-sm font-medium mb-2 mt-4">{{ t('AdditionalEmailAddresses') }}</h4>
        <div v-if="additionalEmails.length > 0" class="space-y-2 mb-3">
          <div v-for="(email, index) in additionalEmails" :key="index"
            class="relative lg:flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md">
            <span>{{ email }}</span>
            <div class="flex gap-2">
              <button @click="setEmailAsPrimary(index)" class="text-sm text-purple-600 hover:text-purple-800">
                {{ t('SetasPrimary') }}
              </button>
              <button @click="removeEmail(index)" class="text-sm text-red-600 hover:text-red-800">
                {{ t('Remove') }}
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500 mb-3">
          {{ t('no...') }}
        </div>

        <div v-if="addingNewEmail" class="mb-3">
          <div class="relative lg:flex gap-2">
            <div class="lg:w-80 w-full">
              <Input v-model="newEmail" :inputType="'email'" />
            </div>
            <button @click="addEmail" class="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
              :disabled="!isValidEmail(newEmail)">
              {{ t('add') }}
            </button>
            <button @click="cancelAddEmail"
              class="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              {{ t('Cancel') }}
            </button>
          </div>
        </div>

        <button v-if="!addingNewEmail" @click="addingNewEmail = true"
          class="text-sm text-purple-600 hover:text-purple-800 flex items-center">
          <span class="mr-1">+</span> {{ t('Addanotheremailaddress') }}
        </button>
      </div>

      <!-- Notification Preferences -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 dark:bg-gray-950 dark:text-white">
        <h3 class="text-lg font-medium mb-3">{{ t('NotificationPreferences') }}</h3>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium">{{ t('SystemNotifications') }}</h4>
              <p class="text-xs text-gray-500">{{ t('important...') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="notifications.system" class="sr-only peer">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600">
              </div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium">{{ t('MarketingEmails') }}</h4>
              <p class="text-xs text-gray-500">{{ t('receive...') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="notifications.marketing" class="sr-only peer">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600">
              </div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium">{{ t('ActivityDigests') }}</h4>
              <p class="text-xs text-gray-500">{{ t('weekly...') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="notifications.digest" class="sr-only peer">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600">
              </div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium">{{ t('SecurityAlerts') }}</h4>
              <p class="text-xs text-gray-500">{{ t('notification...') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="notifications.security" class="sr-only peer">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600">
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Email Format -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 dark:bg-gray-950 dark:text-white">
        <h3 class="text-lg font-medium mb-3">{{ t('EmailFormat') }}</h3>

        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">{{ t('PreferredFormat') }}</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" v-model="emailFormat" value="html"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500" />
                <span class="ml-2 text-sm">{{ t('HTML') }}</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="emailFormat" value="plainText"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500" />
                <span class="ml-2 text-sm">{{ t('PlainText') }}</span>
              </label>
            </div>
          </div>

          <div>
            <Select :lb="t('EmailFrequency')" :options="emailFrequencyOptions" v-model="emailFrequency" />
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end space-x-3 py-4">
        <button @click="resetForm"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          {{ t('Cancel') }}
        </button>
        <button @click="saveChanges" class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
          {{ t('SaveChanges') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification'
import { updateUser, getUserId, getService } from '@/services/api'
import { useAuthStore } from '@/composables/user'

const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'));
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'));
const Spinner = defineAsyncComponent(() => import('@/components/spinner/Spinner.vue'));
const { t } = useI18n();
const toast = useToast()
const authStore = useAuthStore()
// Email settings
const primaryEmail = ref('');
const additionalEmails = ref<any[]>([]);
const editingPrimary = ref(false);
const addingNewEmail = ref(false);
const newEmail = ref('');

// Notification settings
const notifications = ref({
  system: true,
  marketing: false,
  digest: true,
  security: true
});

// Email format
const emailFormat = ref('html');
const emailFrequency = ref('immediately');

// Email editing functions
const toggleEditPrimary = () => {
  editingPrimary.value = !editingPrimary.value;
};

const savePrimaryEmail = async () => {
  const id = authStore.UserId;

  if (!isValidEmail(primaryEmail.value)) {
    toast.warning(t('toast.invalidEmail'));
    return;
  }

  try {
    const payload = {
      email: primaryEmail.value
    };

    await updateUser(id, payload);

    editingPrimary.value = false;
    toast.success(t('toast.emailUpdated'));
    console.log('Primary email updated:', primaryEmail.value);
  } catch (error) {
    console.error('Error updating email:', error);
    toast.error(t('toast.updateErrors'));
  }
};

watch(primaryEmail, (newVal: any, oldVal: any) => {
  console.log('Email changed from', oldVal, 'to', newVal);
  if (!isValidEmail(newVal)) {
    toast.warning(t('toast.invalidEmail'));
  }
});

onMounted(async () => {
  const id = authStore.UserId;

  const response = await getUserId(id);
  console.log("serviceId", response.data)
  // const responseService =    await getService(response.data.serviceId)
  // console.log("serviceId",responseService)
  newEmail.value = response.data.email
  const user = JSON.parse(authStore.user || '{}');
  primaryEmail.value = user.email || ''
});

const addEmail = () => {
  if (isValidEmail(newEmail.value)) {
    additionalEmails.value.push(newEmail.value);
    newEmail.value = '';
    addingNewEmail.value = false;
  } else {
    toast.warning(t('toast.please'))
  }
};

const cancelAddEmail = () => {
  addingNewEmail.value = false;
  newEmail.value = '';
};

const removeEmail = (index: number) => {
  additionalEmails.value.splice(index, 1);
};

const setEmailAsPrimary = (index: number) => {
  const email = additionalEmails.value[index];
  additionalEmails.value.splice(index, 1);
  additionalEmails.value.push(primaryEmail.value);
  primaryEmail.value = email;
};


const saveChanges = () => {

  console.log('Saving email settings:', {
    primaryEmail: primaryEmail.value,
    additionalEmails: additionalEmails.value,
    notifications: notifications.value,
    emailFormat: emailFormat.value,
    emailFrequency: emailFrequency.value
  });

  toast.success(t('toast.emailSettingsSaved'));

};

const resetForm = () => {
  notifications.value = {
    system: true,
    marketing: false,
    digest: true,
    security: true
  };
  emailFormat.value = 'html';
  emailFrequency.value = 'immediately';
  editingPrimary.value = false;
  addingNewEmail.value = false;
  newEmail.value = '';
};

// Utility functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const emailFrequencyOptions = computed(() => [
  { value: 'immediately', label: t('Immediately') },
  { value: 'daily', label: t('DailyDigest') },
  { value: 'weekly', label: t('WeeklyDigest') }
])

</script>
