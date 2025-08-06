<template>
  <div class="general-settings mb-8 max-w-full mx-auto p-6 bg-white rounded-lg">
    <div class="space-y-6">
      <!-- Preferences -->
      <div
        class="bg-white p-5 mb-4 rounded-lg border border-gray-200 dark:bg-gray-950 dark:text-white"
      >
        <h3 class="text-lg font-medium mb-3">{{ t('Preferences') }}</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium">{{ t('Language') }}</h4>
              <p class="text-xs text-gray-500">{{ t('Selectyourpreferredlanguage') }}</p>
            </div>
            <ButtonLanguage></ButtonLanguage>
          </div>
          <!--
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium">{{ t('Timezone') }}</h4>
              <p class="text-xs text-gray-500">{{ t('Setyourlocaltimezone') }}</p>
            </div>
            <div class="w-64">
            <Select :options="timezones"  v-model="preferences.timezone"/>
            </div>
          </div> -->

          <div class="flex items-center justify-between pt-8 mt-10">
            <div>
              <h4 class="text-sm font-medium">{{ t('darkMode') }}</h4>
              <p class="text-xs text-gray-500">{{ t('enabledarktheme') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="preferences.darkMode" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"
              ></div>
            </label>
          </div>

          <div class="flex items-center justify-between pt-2">
            <div>
              <h4 class="text-sm font-medium">{{ t('emailNotifications') }}</h4>
              <p class="text-xs text-gray-500">{{ t('receiveemailnotifications') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="preferences.emailNotifications"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"
              ></div>
            </label>
          </div>

              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg my-6">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="font-semibold text-gray-800">{{ $t('current_system_time') }}</h3>
                    <p class="text-2xl font-mono text-indigo-600">{{ formatTime(hotelTimezone) }}</p>
                  </div>
                  <div class="w-1/3">
                    <Select :lb="$t('system_timezone')" :options="timezones" v-model="hotelTimezone"/>
                  </div>
                </div>
              </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,computed,defineAsyncComponent,onMounted } from 'vue';
import { useTheme } from '@/components/layout/ThemeProvider.vue'
import Select from '@/components/forms/FormElements/Select.vue';
const { toggleTheme }: any = useTheme()
import { useI18n } from 'vue-i18n';
import { watch } from 'vue'

const { t } = useI18n();
const ButtonLanguage = defineAsyncComponent(() => import('@/components/buttons/ButtonLanguage.vue'));

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


const timezones = computed(() => [
  { value: 'Africa/Douala', label: t('timezones.wat') },
  { value: 'UTC', label: t('timezones.utc') },
  { value: 'America/New_York', label: t('timezones.et') },
  { value: 'America/Chicago', label: t('timezones.ct') },
  { value: 'America/Denver', label: t('timezones.mt') },
  { value: 'America/Los_Angeles', label: t('timezones.pt') },
  { value: 'Europe/Paris', label: t('timezones.cet') },
])
const hotelTimezone = ref('Africa/Douala');
const currentTime = ref(new Date());

function formatTime(timezone: string): string {
  return currentTime.value.toLocaleString('fr-FR', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
</script>
