<template>
  <ConfigurationLayout>
    <div class="p-6 space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('configuration.settings.print_and_email_settings.title') }}
          </h2>
        </div>

        <div class="p-6 space-y-8">

          <!-- Check Out -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
              {{ t('configuration.settings.print_and_email_settings.checkout') }}
            </h3>
            <div class="space-y-4">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailThanksAtCheckout" class="rounded border-gray-300" />
                <span class="text-sm text-gray-900 dark:text-white">
                  {{ t('configuration.settings.print_and_email_settings.emailThanksAtCheckout') }}
                </span>
              </label>
              <div class="flex flex-col sm:flex-row gap-3 items-center">
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {{ t('configuration.settings.print_and_email_settings.template') }}
                </span>
                <select v-model="form.checkoutThanksTemplate"
                  class="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
                  <option v-for="opt in templates" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="form.attachFolioWithThanksEmail" class="rounded border-gray-300" />
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ t('configuration.settings.print_and_email_settings.attachFolioThanksEmail') }}
                  </span>
                </label>
              </div>
            </div>
          </section>

          <!-- Guest Review -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
              {{ t('configuration.settings.print_and_email_settings.guestReview') }}
            </h3>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="form.emailGuestReviewRequest" class="rounded border-gray-300" />
              <span class="text-sm text-gray-900 dark:text-white">
                {{ t('configuration.settings.print_and_email_settings.emailGuestReviewRequest') }}
              </span>
            </label>
          </section>

          <!-- Reservation -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
              {{ t('configuration.settings.print_and_email_settings.reservation') }}
            </h3>
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
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
              {{ t('configuration.settings.print_and_email_settings.sendReportsOnNightAudit') }}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.reports.nightAudit" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.nightAudit') }}</span>
              </label>
              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="form.reports.cityLedgerSummary" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.cityLedgerSummary') }}</span>
                <label class="ml-4 flex items-center gap-2">
                  <input type="checkbox" v-model="form.reports.ignoreZeroBalanceAccount" class="rounded border-gray-300" />
                  <span class="text-xs text-gray-600 dark:text-gray-300">
                    {{ t('configuration.settings.print_and_email_settings.ignoreZeroBalance') }}
                  </span>
                </label>
              </div>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.reports.managerReport" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.managerReport') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.reports.frontDeskActivities" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.frontDeskActivities') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.reports.noShowReport" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.noShowReport') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.reports.monthlyOccupancyReport" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.monthlyOccupancyReport') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.reports.monthlyStatisticsReport" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.monthlyStatisticsReport') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.reports.roomsOnBooksReport" class="rounded border-gray-300" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.roomsOnBooksReport') }}</span>
              </label>
              <div class="sm:col-span-2">
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="form.reports.receiveTodayNextDaysBookingHtml" class="rounded border-gray-300" />
                  <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.receiveBookingsHtml') }}</span>
                </label>
                <p class="text-xs text-gray-500 mt-1">
                  {{ t('configuration.settings.print_and_email_settings.receiveBookingsHint') }}
                </p>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('configuration.settings.print_and_email_settings.sendTo') }}
              </label>
              <textarea v-model="form.reports.sendTo" rows="2"
                :placeholder="t('configuration.settings.print_and_email_settings.sendToPlaceholder')"
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
              </textarea>
              <p class="text-xs text-red-500 mt-1">
                {{ t('configuration.settings.print_and_email_settings.sendToHelper') }}
              </p>
            </div>
          </section>

          <!-- ============================================================ -->
          <!--  SECTION WHATSAPP — Destinataires des rapports nuit           -->
          <!-- ============================================================ -->
          <section>
            <div class="flex items-center justify-between mb-3">
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <!-- WhatsApp logo icon -->
                  <svg class="w-5 h-5 text-green-500" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.655 4.83 1.8 6.856L2 30l7.344-1.776A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.56 11.56 0 0 1-5.888-1.608l-.42-.252-4.356 1.056 1.1-4.236-.276-.436A11.52 11.52 0 0 1 4.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.344-8.62c-.348-.174-2.06-1.016-2.38-1.132-.32-.116-.552-.174-.784.174-.232.348-.9 1.132-1.104 1.364-.204.232-.406.26-.754.086-.348-.174-1.47-.542-2.8-1.726-1.034-.922-1.732-2.06-1.936-2.408-.204-.348-.022-.536.152-.708.158-.156.348-.406.522-.61.174-.204.232-.348.348-.58.116-.232.058-.436-.028-.61-.088-.174-.784-1.89-1.074-2.59-.282-.68-.57-.588-.784-.598l-.668-.012c-.232 0-.61.086-.928.434-.32.348-1.22 1.19-1.22 2.902s1.248 3.366 1.422 3.598c.174.232 2.456 3.748 5.952 5.256.832.36 1.482.574 1.988.734.836.266 1.596.228 2.198.138.67-.1 2.06-.842 2.35-1.656.29-.814.29-1.512.204-1.658-.086-.146-.32-.232-.668-.406z"/>
                  </svg>
                  {{ t('configuration.settings.print_and_email_settings.whatsappRecipients') }}
                </h3>
                  <p class="text-xs text-red-500 dark:text-red-400 mt-1">
                  {{ t('configuration.settings.print_and_email_settings.whatsappRecipientsHint') }}
                </p>
              </div>
              <button
                @click="addWhatsappRecipient"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                {{ t('add') }}
              </button>
            </div>

            <!-- Table des destinataires WhatsApp -->
            <div v-if="form.whatsapp.recipients.length > 0" class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-36">
                      {{ t('Name') }}
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-36">
                      {{ t('Phone') }}
                    </th>
                    <!-- Colonnes documents -->
                    <th v-for="doc in whatsappDocColumns" :key="doc.key"
                      class="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      :title="doc.label">
                      <span class="block max-w-[72px] mx-auto truncate">{{ doc.short }}</span>
                    </th>
                    <th class="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr v-for="(recipient, idx) in form.whatsapp.recipients" :key="idx"
                    class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <!-- Nom -->
                    <td class="px-3 py-2">
                      <input
                        v-model="recipient.name"
                        type="text"
                        :placeholder="t('configuration.settings.print_and_email_settings.whatsappNamePlaceholder', 'Ex: Manager')"
                        class="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                      />
                    </td>
                    <!-- Téléphone -->
                    <td class="px-3 py-2">
                      <input
                        v-model="recipient.phone"
                        type="tel"
                        :placeholder="t('configuration.settings.print_and_email_settings.whatsappPhonePlaceholder', '+237600000000')"
                        class="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                      />
                    </td>
                    <!-- Cases à cocher par document -->
                    <td v-for="doc in whatsappDocColumns" :key="doc.key" class="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        v-model="recipient.docs[doc.key]"
                        class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <!-- Supprimer -->
                    <td class="px-3 py-2 text-center">
                      <button
                        @click="removeWhatsappRecipient(idx)"
                        class="text-gray-400 hover:text-red-500 transition-colors"
                        :title="t('remove')">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- État vide -->
            <div v-else
              class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center text-gray-400 dark:text-gray-500">
              <svg class="w-8 h-8 mx-auto mb-2 opacity-50 text-green-400" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.655 4.83 1.8 6.856L2 30l7.344-1.776A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.56 11.56 0 0 1-5.888-1.608l-.42-.252-4.356 1.056 1.1-4.236-.276-.436A11.52 11.52 0 0 1 4.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.344-8.62c-.348-.174-2.06-1.016-2.38-1.132-.32-.116-.552-.174-.784.174-.232.348-.9 1.132-1.104 1.364-.204.232-.406.26-.754.086-.348-.174-1.47-.542-2.8-1.726-1.034-.922-1.732-2.06-1.936-2.408-.204-.348-.022-.536.152-.708.158-.156.348-.406.522-.61.174-.204.232-.348.348-.58.116-.232.058-.436-.028-.61-.088-.174-.784-1.89-1.074-2.59-.282-.68-.57-.588-.784-.598l-.668-.012c-.232 0-.61.086-.928.434-.32.348-1.22 1.19-1.22 2.902s1.248 3.366 1.422 3.598c.174.232 2.456 3.748 5.952 5.256.832.36 1.482.574 1.988.734.836.266 1.596.228 2.198.138.67-.1 2.06-.842 2.35-1.656.29-.814.29-1.512.204-1.658-.086-.146-.32-.232-.668-.406z"/>
              </svg>
              <p class="text-sm">
                {{ t('configuration.settings.print_and_email_settings.whatsappNoRecipients') }}
              </p>
            </div>

          </section>
          <!-- ============================================================ -->

          <!-- Log & Notification Settings -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
              {{ t('configuration.settings.print_and_email_settings.logNotificationSettings') }}
            </h3>
            <div class="space-y-3">
              <div class="flex items-center gap-4">
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.sendNotificationUpdateRate') }}</span>
                <label class="flex items-center gap-2">
                  <input type="radio" value="yes" v-model="form.notification.updateRate" />
                  <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.yes') }}</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="radio" value="no" v-model="form.notification.updateRate" />
                  <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.no') }}</span>
                </label>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('configuration.settings.print_and_email_settings.sendNotificationEmailId') }}
                </label>
                <textarea v-model="form.notification.emails" rows="2"
                  class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
                </textarea>
              </div>
            </div>
          </section>

          <!-- SMTP Email Verification -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
              {{ t('configuration.settings.print_and_email_settings.smtpEmailVerification') }}
            </h3>
            <div class="flex items-center gap-4">
              <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.enableAwsEmailService') }}</span>
              <label class="flex items-center gap-2">
                <input type="radio" value="yes" v-model="form.smtp.enableAwsService" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.yes') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" value="no" v-model="form.smtp.enableAwsService" />
                <span class="text-sm">{{ t('configuration.settings.print_and_email_settings.no') }}</span>
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              {{ t('configuration.settings.print_and_email_settings.smtpEmailVerificationHint') }}
            </p>
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

// ─── Type du destinataire WhatsApp ────────────────────────────────────────────
interface WhatsappRecipientDocs {
  nightAudit: boolean
  cityLedgerSummary: boolean
  managerReport: boolean
  frontDeskActivities: boolean
  noShowReport: boolean
  monthlyOccupancyReport: boolean
  monthlyStatisticsReport: boolean
  roomsOnBooksReport: boolean
  receiveTodayNextDaysBookingHtml: boolean
}

interface WhatsappRecipient {
  name: string
  phone: string
  docs: WhatsappRecipientDocs
}

// ─── Colonnes documents visibles dans le tableau WhatsApp ─────────────────────
const whatsappDocColumns: Array<{ key: keyof WhatsappRecipientDocs; label: string; short: string }> = [
  { key: 'nightAudit',                     label: 'Night Audit',              short: 'Night' },
  { key: 'cityLedgerSummary',              label: 'City Ledger Summary',      short: 'City L.' },
  { key: 'managerReport',                  label: 'Manager Report',           short: 'Mgr' },
  { key: 'frontDeskActivities',            label: 'Front Desk Activities',    short: 'Front D.' },
  { key: 'noShowReport',                   label: 'No Show Report',           short: 'No Show' },
  { key: 'monthlyOccupancyReport',         label: 'Monthly Occupancy',        short: 'Occ.' },
  { key: 'monthlyStatisticsReport',        label: 'Monthly Statistics',       short: 'Stats' },
  { key: 'roomsOnBooksReport',             label: 'Rooms on Books',           short: 'RoB' },
  { key: 'receiveTodayNextDaysBookingHtml',label: 'Bookings HTML',            short: 'Book.' },
]

// ─── Valeur par défaut d'un destinataire WhatsApp ────────────────────────────
const defaultDocs = (): WhatsappRecipientDocs => ({
  nightAudit: false,
  cityLedgerSummary: false,
  managerReport: false,
  frontDeskActivities: false,
  noShowReport: false,
  monthlyOccupancyReport: false,
  monthlyStatisticsReport: false,
  roomsOnBooksReport: false,
  receiveTodayNextDaysBookingHtml: false,
})

const addWhatsappRecipient = () => {
  form.value.whatsapp.recipients.push({ name: '', phone: '', docs: defaultDocs() })
}

const removeWhatsappRecipient = (index: number) => {
  form.value.whatsapp.recipients.splice(index, 1)
}

// ─── Formulaire principal ─────────────────────────────────────────────────────
const form = ref({
  emailThanksAtCheckout: true,
  checkoutThanksTemplate: '',
  attachFolioWithThanksEmail: true,

  emailGuestReviewRequest: false,

  emailReservationReleased: false,
  emailRatesAndAmountToContracted: false,
  emailWithoutRatesToGuest: false,
  emailReservationReleasedToGuestTA: false,
  emailReservationCancelled: false,

  whatsapp: {
    recipients: [] as WhatsappRecipient[],
  },

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
    sendTo: '',
  },

  notification: {
    updateRate: 'no',
    emails: '',
  },

  smtp: {
    enableAwsService: 'no',
  },
})

// ─── Sauvegarde ───────────────────────────────────────────────────────────────
const saveSettings = async () => {
  if (!currentService.value?.id) {
    toast.error(t('toast.printEmailSettingsUpdateError'))
    return
  }

  // Validation légère : supprimer les lignes sans numéro
  form.value.whatsapp.recipients = form.value.whatsapp.recipients.filter(
    (r) => r.phone.trim().length > 0,
  )

  isSaving.value = true
  try {
    const settings = {
      emailThanksAtCheckout:              form.value.emailThanksAtCheckout,
      checkoutThanksTemplate:             form.value.checkoutThanksTemplate,
      attachFolioWithThanksEmail:         form.value.attachFolioWithThanksEmail,

      emailGuestReviewRequest:            form.value.emailGuestReviewRequest,

      emailReservationReleased:           form.value.emailReservationReleased,
      emailRatesAndAmountToContracted:    form.value.emailRatesAndAmountToContracted,
      emailWithoutRatesToGuest:           form.value.emailWithoutRatesToGuest,
      emailReservationReleasedToGuestTA:  form.value.emailReservationReleasedToGuestTA,
      emailReservationCancelled:          form.value.emailReservationCancelled,

      whatsapp:    { ...form.value.whatsapp },
      reports:     { ...form.value.reports },
      notification:{ ...form.value.notification },
      smtp:        { ...form.value.smtp },
    }

    await updateHotelPrintEmailSettings(currentService.value.id, { printEmailSettings: settings })

    serviceStore.setCurrentService({ ...currentService.value, printEmailSettings: settings })
    toast.success(t('toast.printEmailSettingsUpdated'))
  } catch (error) {
    console.error('Error saving print & email settings:', error)
    toast.error(t('toast.printEmailSettingsUpdateError'))
  } finally {
    isSaving.value = false
  }
}

// ─── Chargement depuis le store ───────────────────────────────────────────────
const loadPrintEmailSettingsFromService = () => {
  const s = currentService.value?.printEmailSettings
  if (!s) return

  if (s.emailThanksAtCheckout             !== undefined) form.value.emailThanksAtCheckout             = s.emailThanksAtCheckout
  if (s.checkoutThanksTemplate            !== undefined) form.value.checkoutThanksTemplate            = s.checkoutThanksTemplate
  if (s.attachFolioWithThanksEmail        !== undefined) form.value.attachFolioWithThanksEmail        = s.attachFolioWithThanksEmail
  if (s.emailGuestReviewRequest           !== undefined) form.value.emailGuestReviewRequest           = s.emailGuestReviewRequest
  if (s.emailReservationReleased          !== undefined) form.value.emailReservationReleased          = s.emailReservationReleased
  if (s.emailRatesAndAmountToContracted   !== undefined) form.value.emailRatesAndAmountToContracted   = s.emailRatesAndAmountToContracted
  if (s.emailWithoutRatesToGuest          !== undefined) form.value.emailWithoutRatesToGuest          = s.emailWithoutRatesToGuest
  if (s.emailReservationReleasedToGuestTA !== undefined) form.value.emailReservationReleasedToGuestTA = s.emailReservationReleasedToGuestTA
  if (s.emailReservationCancelled         !== undefined) form.value.emailReservationCancelled         = s.emailReservationCancelled

  if (s.reports)     form.value.reports     = { ...form.value.reports,     ...s.reports }
  if (s.notification)form.value.notification= { ...form.value.notification, ...s.notification }
  if (s.smtp)        form.value.smtp        = { ...form.value.smtp,         ...s.smtp }

  // Charger les destinataires WhatsApp sauvegardés
  if (s.whatsapp?.recipients && Array.isArray(s.whatsapp.recipients)) {
    form.value.whatsapp.recipients = s.whatsapp.recipients.map((r: any) => ({
      name:  r.name  ?? '',
      phone: r.phone ?? '',
      docs:  { ...defaultDocs(), ...(r.docs ?? {}) },
    }))
  }
}

// ─── Templates email ──────────────────────────────────────────────────────────
const fetchEmailTemplates = async (page = 1) => {
  try {
    const response = await emailTemplatesApi.getEmailTemplates({
      hotelId: serviceStore.serviceId,
      page,
      limit: 20,
      includeDeleted: false,
    })
    templates.value = (response?.data ?? []).map((tpl: any) => ({
      value: tpl.id,
      label: tpl.name,
    }))
  } catch (error) {
    console.error('Error fetching email templates:', error)
  }
}

onMounted(() => {
  loadPrintEmailSettingsFromService()
  fetchEmailTemplates(1)
})
</script>

<style scoped>
/* Hover subtil sur les lignes du tableau WhatsApp */
.dark tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.03);
}
</style>