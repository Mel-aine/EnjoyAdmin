<template>
  <ConfigurationLayout>
    <div class="p-6 space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('configuration.settings.print_and_email_settings.title') }}</h2>
        </div>

        <div class="p-6 space-y-8">
          <!-- Check Out -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">{{ t('configuration.settings.print_and_email_settings.checkout') }}</h3>
            <div class="space-y-4">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailThanksAtCheckout" class="rounded border-gray-300" />
                <span class="text-sm text-gray-900 dark:text-white">{{ t('configuration.settings.print_and_email_settings.emailThanksAtCheckout') }}</span>
              </label>

              <div class="flex flex-col sm:flex-row gap-3 items-center">
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('configuration.settings.print_and_email_settings.template') }}</span>
                <select v-model="form.checkoutThanksTemplate" class="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
                  <option v-for="opt in templates" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="form.attachFolioWithThanksEmail" class="rounded border-gray-300" />
                  <span class="text-sm text-gray-900 dark:text-white">{{ t('configuration.settings.print_and_email_settings.attachFolioThanksEmail') }}</span>
                </label>
              </div>
            </div>
          </section>

          <!-- Guest Review -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">{{ t('configuration.settings.print_and_email_settings.guestReview') }}</h3>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="form.emailGuestReviewRequest" class="rounded border-gray-300" />
              <span class="text-sm text-gray-900 dark:text-white">{{ t('configuration.settings.print_and_email_settings.emailGuestReviewRequest') }}</span>
            </label>
          </section>

          <!-- Reservation -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">{{ t('configuration.settings.print_and_email_settings.reservation') }}</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailReservationReleased" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.emailReservationReleased_') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailRatesAndAmountToContracted" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.emailRatesContractedSource') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailWithoutRatesToGuest" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.emailWithoutRatesToGuest') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailReservationReleasedToGuestTA" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.emailReservationReleasedToGuestTA') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailReservationCancelled" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.emailReservationCancelled') }}</span>
              </label>
            </div>
          </section>

          <!-- Send Reports On Night Audit -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">{{ t('configuration.settings.print_and_email_settings.sendReportsOnNightAudit') }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.nightAudit" class="rounded border-gray-300" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.nightAudit') }}</span></label>
              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="form.reports.cityLedgerSummary" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.cityLedgerSummary') }}</span>
                <label class="ml-4 flex items-center gap-2">
                  <input type="checkbox" v-model="form.reports.ignoreZeroBalanceAccount" class="rounded border-gray-300" />
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('configuration.settings.print_and_email_settings.ignoreZeroBalance') }}</span>
                </label>
              </div>
              <!--<label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.expenseVoucher" class="rounded border-gray-300" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.expenseVoucher') }}</span></label>
              -->
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.managerReport" class="rounded border-gray-300" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.managerReport') }}</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.frontDeskActivities" class="rounded border-gray-300" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.frontDeskActivities') }}</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.noShowReport" class="rounded border-gray-300" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.noShowReport') }}</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.monthlyOccupancyReport" class="rounded border-gray-300" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.monthlyOccupancyReport') }}</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.monthlyStatisticsReport" class="rounded border-gray-300" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.monthlyStatisticsReport') }}</span></label>
              <!--<label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.yearlyStatisticsReport" class="rounded border-gray-300" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.yearlyStatisticsReport') }}</span></label>
              --><label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.roomsOnBooksReport" class="rounded border-gray-300" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.roomsOnBooksReport') }}</span></label>
              <div class="sm:col-span-2">
                <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.receiveTodayNextDaysBookingHtml" class="rounded border-gray-300" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.receiveBookingsHtml') }}</span></label>
                <p class="text-xs text-gray-500 mt-1">{{ t('configuration.settings.print_and_email_settings.receiveBookingsHint') }}</p>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('configuration.settings.print_and_email_settings.sendTo') }}</label>
              <textarea v-model="form.reports.sendTo" rows="2" :placeholder="t('configuration.settings.print_and_email_settings.sendToPlaceholder')"
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"></textarea>
              <p class="text-xs text-red-500 mt-1">{{ t('configuration.settings.print_and_email_settings.sendToHelper') }}</p>
            </div>
          </section>

          <!-- Log & Notification Settings -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">{{ t('configuration.settings.print_and_email_settings.logNotificationSettings') }}</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-4">
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.sendNotificationUpdateRate') }}</span>
                <label class="flex items-center gap-2"><input type="radio" value="yes" v-model="form.notification.updateRate" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.yes') }}</span></label>
                <label class="flex items-center gap-2"><input type="radio" value="no" v-model="form.notification.updateRate" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.no') }}</span></label>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('configuration.settings.print_and_email_settings.sendNotificationEmailId') }}</label>
                <textarea v-model="form.notification.emails" rows="2" class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"></textarea>
              </div>
            </div>
          </section>

          <!-- SMTP Email Verification -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">{{ t('configuration.settings.print_and_email_settings.smtpEmailVerification') }}</h3>
            <div class="flex items-center gap-4">
              <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.enableAwsEmailService') }}</span>
              <label class="flex items-center gap-2"><input type="radio" value="yes" v-model="form.smtp.enableAwsService" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.yes') }}</span></label>
              <label class="flex items-center gap-2"><input type="radio" value="no" v-model="form.smtp.enableAwsService" /> <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.no') }}</span></label>
            </div>
            <p class="text-xs text-gray-500 mt-2">{{ t('configuration.settings.print_and_email_settings.smtpEmailVerificationHint') }}</p>
          </section>

          <!-- Actions -->
          <div class="flex justify-end">
            <BasicButton variant="primary" :loading="isSaving" :label="t('Save')" @click="saveSettings" />
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import { updateHotelPrintEmailSettings } from '../../../services/hotelApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { emailTemplatesApi } from '../../../services/configrationApi'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const currentService = computed(() => serviceStore.getCurrentService)
const isSaving = ref(false)

const templates = ref<Array<{ value: string; label: string }>>([])

// Fetch email templates from API and map to select options
const fetchEmailTemplates = async (page = 1) => {
  try {
    const params = {
      hotelId: useServiceStore().serviceId,
      page,
      limit: 20,
      includeDeleted: false,
    }
    const response = await emailTemplatesApi.getEmailTemplates(params)
    const items = response?.data || []
    // Map using template name for both value and label
    templates.value = items.map((tpl: any) => ({
      value: tpl.id,
      label: tpl.name,
    }))
  } catch (error) {
    console.error('Error fetching email templates:', error)
  }
}

const form = ref({
  // Check Out
  emailThanksAtCheckout: true,
  checkoutThanksTemplate: 'thank_you_guest',
  attachFolioWithThanksEmail: true,

  // Guest Review
  emailGuestReviewRequest: false,

  // Reservation
  emailReservationReleased: false,
  emailRatesAndAmountToContracted: false,
  emailWithoutRatesToGuest: false,
  emailReservationReleasedToGuestTA: false,
  emailReservationCancelled: false,

  // Night Audit Reports
  reports: {
    nightAudit: false,
    cityLedgerSummary: false,
    ignoreZeroBalanceAccount: false,
    expenseVoucher: false,
    managerReport: false,
    frontDeskActivities: false,
    noShowReport: false,
    monthlyOccupancyReport: false,
    monthlyStatisticsReport: false,
    yearlyStatisticsReport: false,
    roomsOnBooksReport: false,
    receiveTodayNextDaysBookingHtml: false,
    sendTo: ''
  },

  // Log & Notification
  notification: {
    updateRate: 'no',
    emails: ''
  },

  // SMTP
  smtp: {
    enableAwsService: 'no'
  }
})

const saveSettings = async () => {
  if (!currentService.value || !currentService.value.id) {
    toast.error(t('toast.printEmailSettingsUpdateError'))
    return
  }

  isSaving.value = true
  try {
    const settings = {
      emailThanksAtCheckout: form.value.emailThanksAtCheckout,
      checkoutThanksTemplate: form.value.checkoutThanksTemplate,
      attachFolioWithThanksEmail: form.value.attachFolioWithThanksEmail,

      emailGuestReviewRequest: form.value.emailGuestReviewRequest,

      emailReservationReleased: form.value.emailReservationReleased,
      emailRatesAndAmountToContracted: form.value.emailRatesAndAmountToContracted,
      emailWithoutRatesToGuest: form.value.emailWithoutRatesToGuest,
      emailReservationReleasedToGuestTA: form.value.emailReservationReleasedToGuestTA,
      emailReservationCancelled: form.value.emailReservationCancelled,

      reports: { ...form.value.reports },
      notification: { ...form.value.notification },
      smtp: { ...form.value.smtp }
    }

    await updateHotelPrintEmailSettings(currentService.value.id, { printEmailSettings: settings })

    const updatedService = {
      ...currentService.value,
      printEmailSettings: settings
    }
    serviceStore.setCurrentService(updatedService)

    toast.success(t('toast.printEmailSettingsUpdated'))
  } catch (error) {
    console.error('Error saving print & email settings:', error)
    toast.error(t('toast.printEmailSettingsUpdateError'))
  } finally {
    isSaving.value = false
  }
}

const loadPrintEmailSettingsFromService = () => {
  const service = currentService.value
  if (!service || !service.printEmailSettings) return

  const s = service.printEmailSettings
  if (s.emailThanksAtCheckout !== undefined) form.value.emailThanksAtCheckout = s.emailThanksAtCheckout
  if (s.checkoutThanksTemplate !== undefined) form.value.checkoutThanksTemplate = s.checkoutThanksTemplate
  if (s.attachFolioWithThanksEmail !== undefined) form.value.attachFolioWithThanksEmail = s.attachFolioWithThanksEmail

  if (s.emailGuestReviewRequest !== undefined) form.value.emailGuestReviewRequest = s.emailGuestReviewRequest

  if (s.emailReservationReleased !== undefined) form.value.emailReservationReleased = s.emailReservationReleased
  if (s.emailRatesAndAmountToContracted !== undefined) form.value.emailRatesAndAmountToContracted = s.emailRatesAndAmountToContracted
  if (s.emailWithoutRatesToGuest !== undefined) form.value.emailWithoutRatesToGuest = s.emailWithoutRatesToGuest
  if (s.emailReservationReleasedToGuestTA !== undefined) form.value.emailReservationReleasedToGuestTA = s.emailReservationReleasedToGuestTA
  if (s.emailReservationCancelled !== undefined) form.value.emailReservationCancelled = s.emailReservationCancelled

  if (s.reports) form.value.reports = { ...form.value.reports, ...s.reports }
  if (s.notification) form.value.notification = { ...form.value.notification, ...s.notification }
  if (s.smtp) form.value.smtp = { ...form.value.smtp, ...s.smtp }
}

onMounted(() => {
  loadPrintEmailSettingsFromService()
  fetchEmailTemplates(1)
})
</script>

<style scoped>
</style>
