<template>
  <ConfigurationLayout>
    <div class="p-6 space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Print and Email Settings</h2>
        </div>

        <div class="p-6 space-y-8">
          <!-- Check Out -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">Check Out</h3>
            <div class="space-y-4">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailThanksAtCheckout" class="rounded border-gray-300" />
                <span class="text-sm text-gray-900 dark:text-white">Email Thanks at Check Out</span>
              </label>

              <div class="flex flex-col sm:flex-row gap-3 items-center">
                <span class="text-sm text-gray-700 dark:text-gray-300">Template</span>
                <select v-model="form.checkoutThanksTemplate" class="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
                  <option v-for="opt in templates" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="form.attachFolioWithThanksEmail" class="rounded border-gray-300" />
                  <span class="text-sm text-gray-900 dark:text-white">Attach Folio With Thanks Email at Check Out</span>
                </label>
              </div>
            </div>
          </section>

          <!-- Guest Review -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">Guest Review</h3>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="form.emailGuestReviewRequest" class="rounded border-gray-300" />
              <span class="text-sm text-gray-900 dark:text-white">Email Guest Review Request</span>
            </label>
          </section>

          <!-- Reservation -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">Reservation</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailReservationReleased" class="rounded border-gray-300" />
                <span class="text-sm">Email for Reservation Released</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailRatesAndAmountToContracted" class="rounded border-gray-300" />
                <span class="text-sm">Email with Rates and Amount Details to Contracted source</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailWithoutRatesToGuest" class="rounded border-gray-300" />
                <span class="text-sm">Email without Rates and Amount Details to Guest</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailReservationReleasedToGuestTA" class="rounded border-gray-300" />
                <span class="text-sm">Email for Reservation Released to Guest / TA</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.emailReservationCancelled" class="rounded border-gray-300" />
                <span class="text-sm">Email for Reservation Cancelled</span>
              </label>
            </div>
          </section>

          <!-- Send Reports On Night Audit -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">Send Reports On Night Audit</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.nightAudit" class="rounded border-gray-300" /> <span class="text-sm">Night Audit</span></label>
              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="form.reports.cityLedgerSummary" class="rounded border-gray-300" />
                <span class="text-sm">City Ledger Summary</span>
                <label class="ml-4 flex items-center gap-2">
                  <input type="checkbox" v-model="form.reports.ignoreZeroBalanceAccount" class="rounded border-gray-300" />
                  <span class="text-xs text-gray-600 dark:text-gray-300">Ignore Zero Balance Account</span>
                </label>
              </div>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.expenseVoucher" class="rounded border-gray-300" /> <span class="text-sm">Expense Voucher</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.managerReport" class="rounded border-gray-300" /> <span class="text-sm">Manager Report</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.frontDeskActivities" class="rounded border-gray-300" /> <span class="text-sm">Front Desk Activities</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.noShowReport" class="rounded border-gray-300" /> <span class="text-sm">No Show Report</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.monthlyOccupancyReport" class="rounded border-gray-300" /> <span class="text-sm">Monthly Occupancy Report</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.monthlyStatisticsReport" class="rounded border-gray-300" /> <span class="text-sm">Monthly Statistics Report</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.yearlyStatisticsReport" class="rounded border-gray-300" /> <span class="text-sm">Yearly Statistics Report</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.roomsOnBooksReport" class="rounded border-gray-300" /> <span class="text-sm">Rooms on Books Report</span></label>
              <div class="sm:col-span-2">
                <label class="flex items-center gap-2"><input type="checkbox" v-model="form.reports.receiveTodayNextDaysBookingHtml" class="rounded border-gray-300" /> <span class="text-sm">Receive Todays Booking and Next days Booking List in Email as HTML</span></label>
                <p class="text-xs text-gray-500 mt-1">This will be received in separate email</p>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Send To</label>
              <textarea v-model="form.reports.sendTo" rows="2" placeholder="Enter comma-separated email addresses"
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"></textarea>
              <p class="text-xs text-red-500 mt-1">Enter the email address here, you can enter multiple email address with comma separated values</p>
            </div>
          </section>

          <!-- Log & Notification Settings -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">Log & Notification Settings</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-4">
                <span class="text-sm">Send Notification to Hotel on Update Rate :</span>
                <label class="flex items-center gap-2"><input type="radio" value="yes" v-model="form.notification.updateRate" /> <span class="text-sm">Yes</span></label>
                <label class="flex items-center gap-2"><input type="radio" value="no" v-model="form.notification.updateRate" /> <span class="text-sm">No</span></label>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Send Notification on Email Id :</label>
                <textarea v-model="form.notification.emails" rows="2" class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"></textarea>
              </div>
            </div>
          </section>

          <!-- SMTP Email Verification -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">SMTP Email Verification</h3>
            <div class="flex items-center gap-4">
              <span class="text-sm">Enable AWS Email Service</span>
              <label class="flex items-center gap-2"><input type="radio" value="yes" v-model="form.smtp.enableAwsService" /> <span class="text-sm">Yes</span></label>
              <label class="flex items-center gap-2"><input type="radio" value="no" v-model="form.smtp.enableAwsService" /> <span class="text-sm">No</span></label>
            </div>
            <p class="text-xs text-gray-500 mt-2">Please perform Email Verification process from Settings → Property → Email accounts, if you enable this feature.</p>
          </section>

          <!-- Actions -->
          <div class="flex justify-end">
            <BasicButton variant="primary" :loading="isSaving" label="Save" @click="saveSettings" />
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'

const isSaving = ref(false)

const templates = [
  { value: 'thank_you_guest', label: 'Thank You email to Guest' },
  { value: 'folio_detail_t', label: 'Folio Detail Template - T' }
]

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
  isSaving.value = true
  try {
    // Placeholder: integrate with backend when available
    // await api.savePrintEmailSettings(form.value)
    console.log('Saving Print & Email Settings', form.value)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
</style>
