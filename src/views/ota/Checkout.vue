<template>
  <div>
    <OtaHeader :brand="brand" :currency="selectedCurrency" @currency-change="setCurrency" />

    <!-- Gradient banner and steps -->
    <div class="bg-gradient-to-r from-slate-900 via-blue-900 mt-10 to-slate-800 text-white">
      <div class="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <div class="text-xs uppercase tracking-wide opacity-80">Secure Checkout</div>
          <div class="text-2xl font-semibold">Complete Your Reservation</div>
        </div>
        <div class="hidden md:flex items-center gap-3 text-sm">
          <div class="flex items-center gap-2">
            <span
              class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20"
              >1</span
            >
            <span>Guest Info</span>
          </div>
          <span class="opacity-60">→</span>
          <div class="flex items-center gap-2">
            <span
              class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20"
              >2</span
            >
            <span>Policies</span>
          </div>
          <span class="opacity-60">→</span>
          <div class="flex items-center gap-2">
            <span
              class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20"
              >3</span
            >
            <span>Review</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 pt-14 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <!-- Guest info + policies -->
        <section class="bg-white rounded-xl shadow-sm border">
          <div class="p-5 border-b flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold">Guest Information</h1>
              <div class="text-[12px] text-gray-600 mt-1">
                Not ready to submit your reservation? You can save for later.
              </div>
            </div>
            <button
              @click="showSignIn = !showSignIn"
              type="button"
              class="hidden sm:inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded px-3 py-2 text-sm"
            >
              <span>Sign in to Book Faster</span>
            </button>
          </div>

          <div class="p-5 space-y-6">
            <!-- Sign In Section -->
            <div v-if="showSignIn" class="bg-gray-50 border rounded-lg p-4 relative">
              <button
                @click="showSignIn = false"
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Input
                    :lb="'Username'"
                    :id="'Username'"
                    :for-label="'Username'"
                    :placeholder="'Username'"
                    v-model="loginData.username"
                  />
                </div>
                <div>
                  <label
                    for="password"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Password<span class="text-error-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="loginData.password"
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      autocomplete="current-password"
                      placeholder="Enter your password"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                      required
                    />
                    <span
                      @click="togglePasswordVisibility"
                      class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                    >
                      <svg
                        v-if="!showPassword"
                        class="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                          fill="#98A2B3"
                        />
                      </svg>
                      <svg
                        v-else
                        class="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                          fill="#98A2B3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <a href="#" class="text-sm text-blue-600 hover:underline">Forgot Password?</a>
                <button
                  @click="handleLogin"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white rounded px-6 py-2 text-sm font-medium"
                >
                  Login
                </button>
              </div>
            </div>
          </div>

          <div class="p-3 space-y-6">
            <!-- Guest form -->
            <form class="space-y-3" @submit.prevent>
              <div>
                <div class="flex items-center justify-end mb-2">
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {{ bookingData?.items?.length || 0 }}
                    {{ (bookingData?.items?.length || 0) > 1 ? 'Rooms' : 'Room' }}
                  </span>
                </div>

                <!-- Container avec scroll pour plusieurs chambres -->
                <div
                  class="space-y-3 overflow-y-auto custom-scrollbar"
                  :class="{ 'max-h-[500px] pr-2': (bookingData?.items?.length || 0) > 4 }"
                >
                  <div
                    v-for="(item, index) in bookingData?.items || []"
                    :key="index"
                    class="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors"
                  >
                    <!-- Room Header -->
                    <template v-if="roomGuests[index]">
                      <div class="flex items-center gap-3 mb-3">
                        <div
                          class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0"
                        >
                          {{ index + 1 }}
                        </div>
                        <div>
                          <div class="font-medium text-sm text-gray-900">{{ item.roomName }}</div>
                          <div class="text-xs text-gray-500">
                            {{ item.adults }} {{ item.adults > 1 ? 'Adults' : 'Adult' }}
                            <span v-if="item.children > 0"
                              >, {{ item.children }}
                              {{ item.children > 1 ? 'Children' : 'Child' }}</span
                            >
                          </div>
                        </div>
                      </div>

                      <!-- Guest Form -->
                      <div class="grid sm:grid-cols-3 gap-3">
                        <div class="flex flex-col">
                          <Select
                            :lb="'Title'"
                            :options="GuestTitles"
                            :default-value="'--Select--'"
                            custom-class="h-11"
                            v-model="roomGuests[index].title"
                          />
                        </div>
                        <div class="flex flex-col">
                          <Input
                            :lb="'First Name'"
                            :id="'firstName-' + index"
                            :for-label="'firstName-' + index"
                            :placeholder="'First Name'"
                            v-model="roomGuests[index].firstName"
                          />
                        </div>
                        <div class="flex flex-col">
                          <Input
                            :lb="'Last Name'"
                            :id="'lastName-' + index"
                            :for-label="'lastName-' + index"
                            :placeholder="'Last Name'"
                            v-model="roomGuests[index].lastName"
                          />
                        </div>
                      </div>

                      <!-- Special Requests Toggle -->
                      <div class="mt-3 pt-3 border-t border-gray-100">
                        <button
                          type="button"
                          @click="toggleSpecialRequests(index)"
                          class="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 transition-transform"
                            :class="{ 'rotate-180': showSpecialRequests[index] }"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          <span>Special Requests</span>
                        </button>

                        <div v-if="showSpecialRequests[index]" class="mt-2 space-y-2">
                          <textarea
                            v-model="roomGuests[index].specialRequests"
                            rows="3"
                            placeholder="e.g., High floor, quiet room, early check-in..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:outline-none focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 resize-none"
                          ></textarea>
                          <div
                            class="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4 mt-0.5 flex-shrink-0"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                              />
                            </svg>
                            <span
                              >Special request cannot be guaranteed - but the accommodation will do
                              its best to meet your needs.</span
                            >
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <div class="grid sm:grid-cols-3 gap-3">
                  <div class="flex flex-col">
                    <InputPhone
                      v-model="guest.mobile"
                      :title="'Mobile'"
                      :id="'phone'"
                      :is-required="true"
                      custom-class="h-11"
                    />
                  </div>
                  <div class="flex flex-col sm:col-span-2">
                    <InputEmail
                      v-model="guest.email"
                      placeholder="info@gmail.com"
                      :title="'Email'"
                      required
                      custom-class="h-11"
                    />
                  </div>
                </div>

                <div
                  class="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                    />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Your voucher will be sent to this email address</span>
                </div>
              </div>
            </form>

            <!-- Policies -->
            <div>
              <div class="text-lg font-semibold">Hotel Policy & Booking Conditions</div>
              <div class="mt-2 space-y-4">
                <div class="text-sm text-gray-700">
                  <div class="font-semibold mb-1">Hotel Policy</div>
                  <p>
                    {{
                      bookingData?.policies ||
                      'Our hotel offers on-site dining, business facilities, spa and 24/7 front desk. Complimentary Wi‑Fi and secure parking are available.'
                    }}
                  </p>
                </div>
                <div class="text-sm text-gray-700">
                  <div class="font-semibold mb-1">Cancellation Policy</div>
                  <p>
                    {{
                      bookingData?.cancellationPolicy ||
                      'Free cancellation up to 24 hours before arrival on flexible rates. After that, one night may be charged depending on selected rate conditions.'
                    }}
                  </p>
                </div>
              </div>
              <div class="mt-3 flex items-start gap-2">
                <input type="checkbox" v-model="acceptPolicy" id="accept" class="mt-1" />
                <label for="accept" class="text-sm"
                  >I acknowledge and accept the Terms of Cancellation Policy & Hotel Policy.</label
                >
              </div>
              <div class="mt-3 flex gap-3">
                <button
                  class="bg-yellow-600 hover:bg-yellow-700 text-white rounded px-4 py-2 text-sm flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  :disabled="!acceptPolicy || isBooking"
                  @click="bookNow"
                >
                  <svg
                    v-if="isBooking"
                    class="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>{{ isBooking ? 'Booking...' : 'Book Now' }}</span>
                </button>
                <button class="border rounded px-4 py-2 text-sm" @click="reviewBooking">
                  Review Your Booking
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Booking summary -->
        <aside
          class="bg-white rounded-xl shadow-sm border p-5 lg:sticky lg:top-24 max-h-[fit-content]"
        >
          <div class="font-semibold">{{ brand }}</div>
          <div class="text-[12px] text-gray-600">{{ bookingData?.address }}</div>
          <div class="text-[12px] text-gray-600">
            {{ bookingData?.email }} • {{ bookingData?.phoneNumber }}
          </div>

          <div class="mt-2 grid grid-cols-3 gap-3 text-sm">
            <div>
              <div class="text-gray-600">Check-In</div>
              <div class="font-semibold">{{ formatDate(bookingData?.arrivalDate) }}</div>
            </div>
            <div>
              <div class="text-gray-600">Check-Out</div>
              <div class="font-semibold">{{ formatDate(bookingData?.departureDate) }}</div>
            </div>
            <div>
              <div class="text-gray-600">Nights</div>
              <div class="font-semibold">{{ nights }}</div>
            </div>
            <div>
              <!-- <div class="text-gray-600">Guests</div>
              <div class="font-semibold">
                {{ bookingData?.adults || 0 }} adults, {{ bookingData?.children || 0 }} children
              </div> -->
            </div>
          </div>
           <div class="py-2">
              <button
                class="bg-yellow-500 hover:bg-yellow-600 text-white rounded px-4 py-2 text-sm font-medium transition-colors"
                @click="editBooking"
              >
                Change Dates
              </button>
            </div>

          <div class="mt-2 pt-2">
            <div class="text-sm font-semibold mb-3">
              Rooms & Rates ( Price for {{ nights }} Night{{ nights > 1 ? 's' : '' }} )
            </div>


            <!-- Liste des chambres individuelles -->
            <div class="space-y-4 px-2 overflow-y-auto max-h-[500px] custom-scrollbar">
              <div
                v-for="(item, index) in bookingData?.items || []"
                :key="index"
                class="border-b pb-4"
              >
                <!-- En-tête de la chambre -->
                <div class="font-semibold text-sm mb-1">Room {{ index + 1 }} :</div>
                <div class="text-sm text-gray-700 mb-1">
                  Rateplan Name :{{ item.roomName }} - {{ item.planName }}
                </div>
                <div class="text-sm text-gray-700 mb-2">
                  <span class="font-medium">Pax Details :</span>
                  {{ item.adults }} Adult{{ item.adults > 1 ? 's' : '' }},
                  {{ item.children }} Child{{ item.children > 1 ? 'ren' : '' }}
                </div>

                <!-- Informations supplémentaires -->
                <div class="text-sm text-green-600 italic mb-3">
                  <span>Breakfast included</span>
                  <span>, Pay at the hotel</span>
                  <span>, Free Cancellation</span>
                </div>

                <!-- Tableau des prix -->
                <table class="w-full text-sm border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <td class="py-2 px-3 text-gray-700 border border-gray-300">Room Charges</td>
                      <td class="py-2 px-3 text-right border border-gray-300">
                        {{ formatCurrency( item.planPriceHT) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-3 text-gray-700 border border-gray-300">
                        Extra adult & child rates
                      </td>
                      <td class="py-2 px-3 text-right border border-gray-300">
                        {{ formatCurrency(item.totalExtrasCost) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-3 text-gray-700 border border-gray-300">Taxes & Fees</td>
                      <td class="py-2 px-3 text-right border border-gray-300">
                        {{
                          formatCurrency(
                            (item.extractedRoomTax || 0) + (item.flatTaxPerNight || 0) * nights,
                          )
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Récapitulatif total -->
            <div class="mt-4 pt-3 border-t bg-gray-50 -mx-4 px-4 pb-2">
              <table class="w-full text-sm">
                <tbody>
                  <tr>
                    <td class="py-1 font-medium">Total Room Charges</td>
                    <td class="py-1 text-right font-medium">{{ formatCurrency(roomChargesHT) }}</td>
                  </tr>
                  <tr>
                    <td class="py-1 font-medium">Total Taxes</td>
                    <td class="py-1 text-right font-medium">{{ formatCurrency(taxCalculation.totalTaxes) }}</td>
                  </tr>
                  <tr>
                    <td v-if="extrasTotalTTC" class="py-1 font-medium">
                      Total Extra adult & child rates
                    </td>
                    <td class="py-1 text-right font-medium">
                      {{ formatCurrency(extrasTotalTTC) }}
                    </td>
                  </tr>
                  <tr class="border-t">
                    <td class="py-2 font-bold">Total Price (Inc. Of Taxes)</td>
                    <td class="py-2 text-right font-bold">{{ formatCurrency(finalTotal) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              class="mt-2 text-blue-700 hover:underline text-sm font-medium flex items-center gap-1.5"
              @click="showDetailsModal = true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fill-rule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clip-rule="evenodd"
                />
              </svg>
              View Detailed Breakdown
            </button>

            <!-- Modal Component -->
            <PriceBreakdownModal
              :is-open="showDetailsModal"
              :booking-data="bookingData"
              :nights="nights"
              :total-room-charges="totalRoomChargesTTC"
              :tax-calculation="taxCalculation"
              :discount="discount"
              :final-total="finalTotal"
              :format-currency="formatCurrency"
              :format-tax-label="formatTaxLabel"
              :totalExtracharge="totalExtrasCost"
              @close="showDetailsModal = false"
            />
          </div>

          <div class="mt-4 bg-yellow-50 border rounded p-3 flex justify-between items-center">
            <div class="text-sm">Pay at Hotel</div>
            <div>
              <div class="text-xl font-bold text-blue-800">{{ formatCurrency(finalTotal) }}</div>
              <div class="text-xs text-gray-600 mt-1">
                <span v-if="allTaxesIncluded">Taxes included</span>
                <span v-else-if="hasMixedTaxStatus">Taxes vary by room</span>
                <span v-else>+ {{ formatCurrency(taxCalculation.totalTaxes) }} taxes</span>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <div class="text-md font-semibold text-amber-600 border-b-2 border-amber-500 pb-1 mb-3">
              Offers :
            </div>

            <!-- Liste des offres disponibles -->
            <div class="space-y-2 mb-3">
              <label
                v-for="(offer, index) in availableOffers"
                :key="index"
                class="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="radio"
                  name="offer"
                  :value="offer.code"
                  v-model="selectedOffer"
                  class="w-4 h-4 text-amber-600"
                />
                <span class="text-gray-700">{{ offer.name }}</span>
                <span v-if="offer.info" class="text-amber-500 cursor-help" :title="offer.info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d59d5d"
                    stroke-width="1"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-info-icon lucide-info"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </span>
              </label>

              <!-- Option code promo manuel -->
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="offer"
                  value="manual"
                  v-model="selectedOffer"
                  class="w-4 h-4 text-amber-600"
                />
                <span class="text-gray-700">Enter Promotional code</span>
              </label>
            </div>

            <!-- Champ de saisie du code promo -->
            <div v-if="selectedOffer === 'manual'" class="flex gap-2">
              <input
                v-model="promo"
                class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                placeholder="Enter Promotional code"
              />
              <button
                class="bg-yellow-500 hover:bg-yellow-600 text-white rounded px-4 py-2 text-sm font-medium transition-colors"
                @click="applyPromo"
              >
                Apply
              </button>
            </div>

            <!-- Message de confirmation -->
            <div v-if="promoApplied" class="mt-2 text-xs text-green-700 bg-green-50 p-2 rounded">
              ✓ Promo applied: -{{ formatCurrency(discount) }}
            </div>

            <!-- Message d'erreur -->
            <div v-if="promoError" class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
              ✗ {{ promoError }}
            </div>
          </div>
        </aside>
      </div>
    </div>

    <BookingReviewModal
      :is-open="showReviewModal"
      :booking-data="bookingData"
      :guest="guest"
      :nights="nights"
      :brand="brand"
      :selected-currency="selectedCurrency"
      :total-room-charges="totalRoomChargesTTC"
      :taxes="taxCalculation"
      :discount="discount"
      :final-total="finalTotal"
      :tax-calculation="taxCalculation"
      :accept-policy="acceptPolicy"
      @close="showReviewModal = false"
      @edit="editBooking"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import OtaHeader from './components/OtaHeader.vue'
import { useBookingSummaryStore } from '@/views/ota/composables/bookingSummary'
import { createOTAReservation } from '@/views/ota/services/otaApi'
import BookingReviewModal from '@/views/ota/components/ReviewBooking.vue'
import { calculateCartTaxes, formatTaxLabel } from '@/views/ota/utils/taxCalculation'
import Select from '@/components/forms/FormElements/Select.vue'
import InputPhone from '@/components/forms/FormElements/InputPhone.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import PriceBreakdownModal from './components/PriceBreakdownModal.vue'

const router = useRouter()
const route = useRoute()
const bookingStore = useBookingSummaryStore()
const showDetailsModal = ref(false)

const hotelId: any = computed(() => route.query.hotelId)
const bookingData = computed(() => bookingStore.getBookingData())
const showReviewModal = ref(false)

const GuestTitles = computed(() => [
  { label: 'Mr', value: 'Mr' },
  { label: 'Mrs', value: 'Mrs' },
  { label: 'Miss', value: 'Miss' },
  { label: 'Dr', value: 'Dr' },
])

// Sign In
const showSignIn = ref(false)
const showPassword = ref(false)
const loginData = ref({
  username: '',
  password: '',
})

const availableOffers = ref([
  {
    code: 'PROMO_ALL',
    name: 'PROMO SUR TOUS TYPES DE CHAMBRES',
    info: 'This promotion code will provide discount on all rooms you have selected',
  },
])

const selectedOffer = ref(null)
const promoError = ref('')

// Room guests - Un guest par chambre
const roomGuests = ref<
  Array<{
    title: string
    firstName: string
    lastName: string
    specialRequests: string
  }>
>([])

// Special requests visibility
const showSpecialRequests = ref<Record<number, boolean>>({})

// Vérifier si on a des données
onMounted(() => {
  console.log('bookingData', bookingData.value)
  if (!bookingData.value || !bookingData.value.items || bookingData.value.items.length === 0) {
    alert('No booking data found. Redirecting to booking page.')
    router.push({ name: 'WebBooking', params: { id: hotelId.value } })
  } else {
    // Initialiser un guest par chambre
    roomGuests.value = (bookingData.value.items || []).map(() => ({
      title: '',
      firstName: '',
      lastName: '',
      specialRequests: '',
    }))
  }
})

const brand = computed(() => bookingData.value?.hotelName || '')
const selectedCurrency = ref<string>(bookingData.value?.currency || 'XAF')

function setCurrency(c: string) {
  selectedCurrency.value = c
}

// Nombre de nuits
const nights = computed(() => {
  return Number(bookingData.value?.nights || 1)
})

// Guest form
const guest = ref({
  mobile: '',
  email: '',
})

const acceptPolicy = ref<boolean>(false)

// Price breakdown & promo
const showDetails = ref<boolean>(false)
const promo = ref<string>('')
const promoApplied = ref<boolean>(false)

const taxesOnExtrasAmount = computed(() => Number(taxCalculation.value.taxesOnExtras ?? 0))

const extrasTotalTTC = computed(() => {
  return Number(taxCalculation.value.extrasCost ?? 0) + taxesOnExtrasAmount.value
})

const totalRoomChargesTTC = computed(() => {
  const items = bookingData.value?.items || []
  return items.reduce((sum, item) => {
    // Prix unitaire TTC * Quantité * Nuits
    const price = Number(item.planPriceTTC || item.planPrice || 0)
    const qty = Number(item.quantity || 1)
    return sum + price * qty * nights.value
  }, 0)
})

// Vérifier si on a un mix
const hasMixedTaxStatus = computed(() => {
  const items = bookingData.value?.items || []
  const withTax = items.some((item) => item.taxIncluded === true)
  const withoutTax = items.some((item) => item.taxIncluded !== true)
  return withTax && withoutTax
})

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedCurrency.value,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function applyPromo() {
  promoApplied.value = (promo.value || '').trim().toUpperCase() === 'PROMO10'
  if (!promoApplied.value) {
    alert('Invalid promo code')
  }
}

// Toggle special requests pour une chambre
function toggleSpecialRequests(index: number) {
  showSpecialRequests.value = {
    ...showSpecialRequests.value,
    [index]: !showSpecialRequests.value[index],
  }
}

// Toggle password visibility
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

// Handle login
function handleLogin() {
  console.log('Login attempt:', loginData.value)
  // Implémentez votre logique de connexion ici
  // Après connexion réussie :
  // showSignIn.value = false
}

const isBooking = ref(false)

async function bookNow() {
  if (!acceptPolicy.value) {
    alert('Please accept the terms and conditions')
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!guest.value.email || !emailRegex.test(guest.value.email)) {
    alert('Please enter a valid email address')
    return
  }

  if (!guest.value.mobile) {
    alert('Please enter your mobile number')
    return
  }

  // Validation des informations des guests de chambre
  const missingGuestInfo = roomGuests.value.some((guest, index) => {
    if (!guest.firstName || !guest.lastName) {
      alert(`Please fill in guest information for Room ${index + 1}`)
      return true
    }
    return false
  })

  if (missingGuestInfo) {
    return
  }

  try {
    isBooking.value = true

    const bookingPayload: any = {
      hotelId: bookingData.value?.hotelId || '',
      arrivalDate: bookingData.value?.arrivalDate || '',
      departureDate: bookingData.value?.departureDate || '',
      nights: nights.value,
      email: guest.value.email,
      mobile: guest.value.mobile,
      guest: guest.value,
      roomGuests: roomGuests.value,
      items:
        bookingData.value?.items.map((item, index) => ({
          ...item,
          totalPrice: item.planPrice * item.quantity * nights.value,
          guestInfo: roomGuests.value[index],
          extraCharges: item.extraCharges || [],
          mealPlanRateInclude: item.mealPlanRateInclude ?? true
        })) || [],
      subtotal: taxCalculation.value.roomChargesHT,
      taxes: taxCalculation.value.totalTaxes,
      // taxBreakdown: taxCalculation.value.breakdown,
      discount: discount.value,
      totalPrice: finalTotal.value,
      currency: selectedCurrency.value,
      promoCode: promoApplied.value ? promo.value : null,
    }

    console.log('Booking payload:', bookingPayload)
    console.log('roomGuests payload:', roomGuests)

    const response = await createOTAReservation(bookingPayload, hotelId.value)

    if (response.success) {
      bookingStore.clearBookingData()
      router.push({
        path: '/ota/confirmation',
        query: {
          reservationId: response.reservationId,
          email: guest.value.email,
          hotelId: hotelId.value,
        },
      })
    } else {
      throw new Error(response.error || 'Booking failed')
    }
  } catch (error: any) {
    console.error('Booking error:', error)
    alert(
      `Booking failed: ${error.message || 'An error occurred. Please try again or contact support.'}`,
    )
  } finally {
    isBooking.value = false
  }
}

function reviewBooking() {
  showReviewModal.value = true
}

const editBooking = () => {
  showReviewModal.value = false
  router.push({ name: 'WebBooking', params: { id: hotelId.value } })
}

// Calcul des extras totaux
const totalExtrasCost = computed(() => {
  const items = bookingData.value?.items || []
  return items.reduce((sum, item) => {
    return sum + Number(item.totalExtrasCost || 0)
  }, 0)
})

// Vérification des taxes (pour l'affichage "Taxes included")
const allTaxesIncluded = computed(() => {
  return bookingData.value?.taxIncluded === true
})

const grandTotal = computed(() => {
  return totalRoomChargesTTC.value + totalExtrasCost.value
})

const taxRates = computed(() => {
  const taxes = bookingData.value?.taxes || []

  const percentRate = taxes
    .filter((t) => t.type === 'flat_percentage')
    .reduce((sum, t) => sum + parseFloat(t.percent) / 100, 0)

  const flatAmountPerNight = taxes
    .filter((t) => t.type === 'flat_amount')
    .reduce((sum, t) => sum + parseFloat(t.rate), 0)

  return { percentRate, flatAmountPerNight }
})

//
const taxCalculation: any = computed(() => {
  const items = bookingData.value?.items || []
  const taxesDef = bookingData.value?.taxes || []

  const totalRooms = items.reduce((acc, item) => acc + (item.quantity || 1), 0)

  // Garder les valeurs brutes (non arrondies)
  const totalFlatTax = taxRates.value.flatAmountPerNight * nights.value * totalRooms
  const baseSubjectToVat = totalRoomChargesTTC.value - totalFlatTax
  const totalHT = baseSubjectToVat / (1 + taxRates.value.percentRate)
  const totalExtractedVat = baseSubjectToVat - totalHT

  const extrasHT = totalExtrasCost.value / (1 + taxRates.value.percentRate)
  const extrasVat = totalExtrasCost.value - extrasHT

  const totalVat = totalExtractedVat + extrasVat


  const totalTaxesRaw = totalFlatTax + totalVat

  const breakdown: any[] = []

  if (totalFlatTax > 0) {
    const tName = taxesDef.find((t: any) => t.type === 'flat_amount')?.name || 'Taxe de Séjour'
    breakdown.push({
      taxId: 'flat',
      taxName: tName,
      amount: totalFlatTax,
      amountDisplay: Math.round(totalFlatTax),
      type: 'flat_amount',
    })
  }

  if (totalVat > 0) {
    const tName = taxesDef.find((t: any) => t.type === 'flat_percentage')?.name || 'TVA'
    breakdown.push({
      taxId: 'vat',
      taxName: tName,
      amount: totalVat,
      amountDisplay: Math.round(totalVat),
      type: 'flat_percentage',
    })
  }

  return {
    // Valeurs brutes pour les calculs
    roomChargesHT: totalHT,
    roomChargesTTC: totalRoomChargesTTC.value,
    extrasCost: extrasHT + extrasVat,
    extractedTaxes: totalVat,
    flatTaxes: totalFlatTax,
    totalTaxes: totalTaxesRaw,
    grandTotal: grandTotal.value,

    // Valeurs arrondies pour l'affichage
    roomChargesHTDisplay: Math.round(totalHT),
    roomChargesTTCDisplay: Math.round(totalRoomChargesTTC.value),
    extrasCostDisplay: Math.round(extrasHT + extrasVat),
    extractedTaxesDisplay: Math.round(totalVat),
    flatTaxesDisplay: Math.round(totalFlatTax),
    totalTaxesDisplay: Math.round(totalTaxesRaw),
    grandTotalDisplay: Math.round(grandTotal.value),

    breakdown: breakdown,
  }
})
const roomChargesHT = computed(() => taxCalculation.value.roomChargesHT)
const totalTaxes = computed(() => taxCalculation.value.totalTaxes)
const discount = computed(() => (promoApplied.value ? Math.round(grandTotal.value * 0.1) : 0))
const finalTotal = computed(() => Math.max(grandTotal.value - discount.value, 0))
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.5);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background-color: rgba(200, 200, 200, 0.2);
}
</style>
