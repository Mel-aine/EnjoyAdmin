<template>
  <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0 h-full overflow-hidden">
    <div class="relative flex flex-col justify-center w-full h-full lg:flex-row dark:bg-gray-900">
      <div class="flex flex-col flex-1 w-full lg:w-1/2">
        <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div class="mb-2 sm:mb-6">
              <h1
                class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
              >
                <strong>{{ resetMode ? $t('resetPasswordTitle') : $t('SignIn') }}</strong>
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ resetMode ? $t('Enteryourresetinfo') : $t('Enteryouremail') }}
              </p>
            </div>
            <div>
              <template v-if="accountPickerMode && !selectedAccount">
                <div class="space-y-4">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ $t('selectAccountToContinue') }}
                  </p>
                  <div class="grid grid-cols-1 gap-3">
                    <button
                      v-for="acc in rememberedAccounts"
                      :key="acc.id ?? acc.email"
                      type="button"
                      @click="selectAccount(acc)"
                      class="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <div
                        class="h-9 w-9 rounded-full bg-purple-500 text-white flex items-center justify-center uppercase"
                      >
                        {{ (acc.name || acc.email).slice(0, 1) }}
                      </div>
                      <div class="text-left">
                        <div class="text-sm font-medium text-gray-800 dark:text-white/90">
                          {{ acc.name || acc.email }}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ acc.email }}</div>
                      </div>
                    </button>
                  </div>
                  <div class="pt-1">
                    <button
                      type="button"
                      @click="useAnotherAccount"
                      class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      {{ $t('useAnotherAccount') }}
                    </button>
                  </div>
                </div>
              </template>

              <form v-else-if="!resetMode && !emailVerificationRequired" @submit.prevent="handleSubmit">
                <div class="space-y-3">
                  <p
                    v-if="error"
                    class="text-red-500 bg-red-100 border border-red-300 px-4 py-2 rounded-md text-md flex items-center space-x-2 w-fit mx-auto shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{{ error }}</span>
                  </p>

                  <div v-if="!selectedAccount && !emailVerificationRequired">
                    <label
                      for="email"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      {{ $t('Email') }}<span class="text-error-500">*</span>
                    </label>
                    <input
                      v-model="email"
                      type="email"
                      id="email"
                      autocomplete="username"
                      name="email"
                      placeholder="info@gmail.com"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                      required
                    />
                  </div>

                  <div
                    v-if="selectedAccount"
                    class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5"
                  >
                    <div
                      class="h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center uppercase"
                    >
                      {{ (selectedAccount.name || selectedAccount.email).slice(0, 1) }}
                    </div>
                    <div class="text-left">
                      <div class="text-sm font-medium text-gray-800 dark:text-white/90">
                        {{ selectedAccount.name || selectedAccount.email }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ selectedAccount.email }}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      for="password"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      {{ $t('Password') }}<span class="text-error-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        id="password"
                        autocomplete="current-password"
                        :placeholder="$t('Enteryourpassword')"
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

                  <div class="flex items-center justify-between">
                    <div>
                      <label
                        for="keepLoggedIn"
                        class="flex items-center text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400"
                      >
                        <div class="relative">
                          <input
                            v-model="keepLoggedIn"
                            type="checkbox"
                            id="keepLoggedIn"
                            class="sr-only"
                          />
                          <div
                            :class="
                              keepLoggedIn
                                ? 'border-brand-500 bg-brand-500'
                                : 'bg-transparent border-gray-300 dark:border-gray-700'
                            "
                            class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]"
                          >
                            <span :class="keepLoggedIn ? '' : 'opacity-0'">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                  stroke="white"
                                  stroke-width="1.94437"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                        {{ $t('Keepmeloggedin') }}
                      </label>
                    </div>

                    <button
                      type="button"
                      @click="toggleResetMode"
                      class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 ml-3"
                    >
                      {{ t('resetPasswordTitle') }}
                    </button>
                  </div>

                  <div>
                    <button
                      type="submit"
                      class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-purple-500 shadow-theme-xs hover:bg-purple-600"
                    >
                      <span v-if="!isLoading">{{ $t('SignIn') }}</span>
                      <span v-else class="flex items-center gap-2">
                        <Spinner class="w-4 h-4" />
                        {{ $t('Processing') }}...
                      </span>
                    </button>
                  </div>
                </div>
              </form>

              <div v-if="resetMode" class="mt-4 space-y-3 border-t pt-4">
                <div class="flex items-center gap-2 text-sm font-semibold">
                  <button
                    type="button"
                    @click="toggleResetMode"
                    class="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      class="text-gray-600 dark:text-gray-300"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <span>{{ t('resetPasswordTitle') }}</span>
                </div>
                <div class="grid grid-cols-1 gap-3">
                  <div>
                    <label
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >{{ t('resetUsernameOrEmail') }}</label
                    >
                    <input
                      v-model="resetUsername"
                      type="text"
                      placeholder="user@example.com"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                    />
                  </div>
                  <div>
                    <label
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >{{ t('resetHotelId') }}</label
                    >
                    <input
                      v-model="resetHotelId"
                      type="text"
                      placeholder="123"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                    />
                  </div>
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      @click="verifyReset"
                      :disabled="isVerifyingReset"
                      class="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      <span v-if="!isVerifyingReset">{{ t('verify') }}</span>
                      <span v-else class="flex items-center gap-2"
                        ><Spinner class="w-4 h-4" />{{ t('verifying') }}...</span
                      >
                    </button>
                    <button
                      v-if="resetSent"
                      type="button"
                      @click="backToLogin"
                      class="px-4 py-2 text-sm text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      {{ t('backToLogin') }}
                    </button>
                  </div>
                  <p v-if="resetVerifyError" class="text-xs text-red-600">{{ resetVerifyError }}</p>
                  <p v-if="resetSendError" class="text-xs text-red-600">{{ resetSendError }}</p>
                  <div
                    v-if="resetSent"
                    class="p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
                  >
                    <p class="text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{{ t('checkEmailForReset') }}</span>
                    </p>
                    <p class="text-xs text-green-600 dark:text-green-400 mt-1">
                      {{ t('checkEmailInstructions') }}
                    </p>
                  </div>
                </div>
              </div>
              <div></div>

                <div v-if="emailVerificationRequired" class="space-y-4">
                  <div class="flex items-center gap-2 text-sm font-semibold">
                    <button
                      type="button"
                      @click="backToLogin"
                      class="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="text-gray-600 dark:text-gray-300"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <span>{{ t('emailVerificationRequired') }}</span>
                  </div>

                  <div class="p-6 rounded-lg bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
                    <div class="flex flex-col items-center text-center gap-4">
                      <div class="w-16 h-16 bg-purple-100 dark:bg-purple-800/50 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-8 w-8 text-purple-600 dark:text-purple-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>

                      <div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                          {{ t('checkYourEmail') }}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {{ t('verificationEmailSentTo') }}
                        </p>
                        <p class="text-sm font-medium text-gray-800 dark:text-white">
                          {{ verificationEmail }}
                        </p>
                      </div>

                      <div class="w-full space-y-3 mt-2">
                        <button
                          type="button"
                          @click="resendVerificationEmail"
                          :disabled="isResendingVerification"
                          class="w-full px-4 py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <span v-if="!isResendingVerification">
                            {{ t('resendVerificationEmail') }}
                          </span>
                          <span v-else-if="isResendingVerification" class="flex items-center gap-2">
                            <Spinner class="w-4 h-4" />
                            {{ t('sending') }}...
                          </span>

                        </button>
                        <button
                          v-if="verificationResent"
                          type="button"
                          @click="backToLogin"
                          class="w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/30 hover:bg-gray-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                        >
                          {{ t('backToLogin') }}
                        </button>

                        <p v-if="resendVerificationError" class="text-sm text-red-600 dark:text-red-400">
                          {{ resendVerificationError }}
                        </p>

                        <div v-if="verificationResent" class="p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                          <p class="text-sm text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {{ t('verificationEmailResent') }}
                          </p>
                        </div>
                      </div>

                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
                        {{ t('didntReceiveEmail') }}
                      </p>
                    </div>
                  </div>
                </div>

            </div>
          </div>
        </div>
      </div>
      <div
        class="relative hidden h-full lg:flex lg:w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-[#7c4ad8] via-[#4C1D95] to-[#4e2a92]"
      >
        <!-- Fond d'ambiance  -->
        <div class="absolute inset-0">
          <div
            class="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[120px] opacity-20 animate-pulse"
          ></div>
          <div
            class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] opacity-20 animate-pulse"
            style="animation-delay: 2s"
          ></div>
        </div>

        <!-- Contenu Central -->
        <div
          class="relative z-10 flex flex-col items-center justify-between w-full h-full max-w-xl px-12 pb-20"
        >
          <!-- Espaceur haut pour centrer le contenu principal -->
          <div class="flex-1 flex flex-col justify-center w-full">
            <!-- Section Textes Animés -->
            <div class="relative h-48 w-full mb-6">
              <transition-group
                enter-active-class="transition-all duration-700 ease-out"
                leave-active-class="transition-all duration-500 ease-in absolute w-full"
                enter-from-class="opacity-0 translate-y-4"
                leave-to-class="opacity-0 -translate-y-4"
              >
                <div
                  v-for="(message, index) in messages"
                  v-show="index === currentMessageIndex"
                  :key="index"
                  class="absolute inset-0 flex flex-col items-center text-center"
                >
                  <h2 class="text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
                    {{ message.title }}
                  </h2>
                  <p class="text-lg text-purple-100 font-medium leading-relaxed opacity-90">
                    {{ message.text }}
                  </p>
                </div>
              </transition-group>
            </div>

            <!-- Indicateurs (Points) -->
            <div class="flex justify-center gap-3 mb-16">
              <div
                v-for="(_, index) in messages"
                :key="index"
                :class="[
                  'h-1.5 rounded-full transition-all duration-500',
                  index === currentMessageIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/30',
                ]"
              ></div>
            </div>

            <!-- Section Partenaires-->
            <div class="grid grid-cols-3 gap-4 w-full">
              <div
                v-for="partner in partners"
                :key="partner.name"
                class="bg-white rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 flex items-center justify-center"
              >
                <!-- Si logo présent -->
                <img
                  v-if="partner.logo"
                  :src="partner.logo"
                  :alt="partner.name"
                  class="h-12 w-auto object-contain"
                />

                <!-- Si pas de logo, affiche le texte -->
                <span
                  v-else
                  class="text-lg font-bold text-gray-800"
                >
                  {{ partner.name }}
                </span>
              </div>
            </div>
          </div>

          <!-- Footer: Support Unique -->
          <div class="mt-auto pt-8">
            <div
              class="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full backdrop-blur-sm border border-white/10"
            >
              <div class="relative flex h-3 w-3">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                ></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <div class="text-sm font-semibold text-white tracking-wide">
                Support <span class="text-purple-200">24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '@/composables/serviceStore'
import { useRouter } from 'vue-router'
import {
  auth,
  validateEmail,
  validatePassword,
  stopAuthAutoRefresh,
  resendEmailVerification,
  requestPasswordReset,
} from '@/services/api'
import { checkHotelExists } from '@/services/configrationApi'
import Spinner from '@/components/spinner/Spinner.vue'
import { useI18n } from 'vue-i18n'
import { useStatusColor } from '@/composables/statusColorStore'

const { t } = useI18n()
const isLoading = ref(false)
const authStore = useAuthStore()
const serviceStore = useServiceStore()
const statusColor = useStatusColor()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const keepLoggedIn = ref(false)
const error = ref<string | null>(null)
type RememberedAccount = { id?: number | string; name?: string; email: string }
const rememberedAccounts = ref<RememberedAccount[]>([])
const accountPickerMode = ref(false)
const selectedAccount = ref<RememberedAccount | null>(null)
// Reset password state
const resetMode = ref(false)
const resetUsername = ref('')
const resetHotelId = ref('')
const resetVerifyError = ref<string | null>(null)
const resetSendError = ref<string | null>(null)
const isVerifyingReset = ref(false)
const isSendingReset = ref(false)
const resetVerified = ref(false)
const resetSent = ref(false)
const currentMessageIndex = ref(0)
let intervalId: number | null = null
const loginAttempts = ref(0)
const MAX_LOGIN_ATTEMPTS = 3
// Email verification state
const emailVerificationRequired = ref(false)
const verificationEmail = ref('')
const isResendingVerification = ref(false)
const verificationResent = ref(false)
const resendVerificationError = ref<string | null>(null)

// Cookie helpers
function setCookie(
  name: string,
  value: string,
  options?: {
    days?: number
    secure?: boolean
    sameSite?: 'Lax' | 'Strict' | 'None'
    path?: string
  },
) {
  let expires = ''
  if (options?.days) {
    const d = new Date()
    d.setTime(d.getTime() + options.days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + d.toUTCString()
  }
  const path = '; path=' + (options?.path ?? '/')
  const sameSite = options?.sameSite ? '; samesite=' + options.sameSite : ''
  const secure = options?.secure ? '; secure' : ''
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}${path}${sameSite}${secure}`
}

function getCookie(name: string): string | null {
  const nameEQ = encodeURIComponent(name) + '='
  const parts = document.cookie.split(';')
  for (let c of parts) {
    c = c.trim()
    if (c.startsWith(nameEQ)) {
      return decodeURIComponent(c.substring(nameEQ.length))
    }
  }
  return null
}

function deleteCookie(name: string, path: string = '/') {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

onMounted(() => {
  try {
    // Prefer cookie; migrate from localStorage if present
    let raw = getCookie('rememberedAccounts')
    const ls = localStorage.getItem('rememberedAccounts')
    if (!raw && ls) {
      setCookie('rememberedAccounts', ls, {
        days: 30,
        secure: location.protocol === 'https:',
        sameSite: 'Lax',
        path: '/',
      })
      // Cleanup localStorage after migration
      localStorage.removeItem('rememberedAccounts')
      raw = ls
    }
    const list = raw ? (JSON.parse(raw) as RememberedAccount[]) : []
    rememberedAccounts.value = Array.isArray(list) ? list : []
    if (rememberedAccounts.value.length > 0 && !authStore.isAuthenticated) {
      accountPickerMode.value = true
    }
  } catch (e) {
    rememberedAccounts.value = []
  }
})

const selectAccount = (acc: RememberedAccount) => {
  selectedAccount.value = acc
  email.value = acc.email
}

const useAnotherAccount = () => {
  selectedAccount.value = null
  accountPickerMode.value = false
  email.value = ''
}

const verifyReset = async () => {
  resetVerifyError.value = null
  resetSendError.value = null
  resetVerified.value = false
  resetSent.value = false
  isVerifyingReset.value = true
  try {
    if (!resetUsername.value || !resetHotelId.value) {
      resetVerifyError.value = t('enterUserAndHotel')
      return
    }
    const hotelResp = await checkHotelExists(Number(resetHotelId.value))
    const exists = hotelResp?.data?.exists ?? true
    if (!exists) {
      resetVerifyError.value = t('hotelNotFoundOrInactive')
      return
    }
    await validateEmail(resetUsername.value)
    resetVerified.value = true
    // Automatically send reset link after successful verification
    await sendResetLink()
  } catch (e: any) {
    if (e?.response?.status === 404) {
      resetVerifyError.value = t('userNotFound')
    } else {
      resetVerifyError.value = e?.response?.data?.message || t('verificationFailed')
    }
  } finally {
    isVerifyingReset.value = false
  }
}

const sendResetLink = async () => {
  resetSendError.value = null
  resetSent.value = false
  isSendingReset.value = true
  try {
    await requestPasswordReset({ email: resetUsername.value, hotelId: resetHotelId.value })
    resetSent.value = true
  } catch (e: any) {
    resetSendError.value = e?.response?.data?.message || t('unableToSendResetLink')
  } finally {
    isSendingReset.value = false
  }
}

const toggleResetMode = () => {
  resetMode.value = !resetMode.value
  if (!resetMode.value) {
    resetUsername.value = ''
    resetHotelId.value = ''
    resetVerifyError.value = null
    resetSendError.value = null
    isVerifyingReset.value = false
    isSendingReset.value = false
    resetVerified.value = false
    resetSent.value = false
  }
}


const handleSubmit = async () => {
  error.value = null
  loginAttempts.value++

  if (!email.value.trim() || !password.value.trim()) {
    error.value = t('emailAndPasswordRequired')
    return
  }

  isLoading.value = true

  try {
    const res = await auth({
      email: email.value.trim().toLowerCase(),
      password: password.value,
      keepLoggedIn: keepLoggedIn.value,
    })

    const { user, access_token } = res.data.data
    const token = access_token.token

    authStore.login(user, token)
    authStore.setRoleId(user.roleId)
    authStore.setUserId(user.id)

    if (keepLoggedIn.value) {
      const entry: RememberedAccount = {
        id: user.id,
        name: user.name || user.fullName || user.username || user.email,
        email: user.email || email.value,
      }
      const existing = rememberedAccounts.value.filter((a) => a.email !== entry.email)
      rememberedAccounts.value = [entry, ...existing].slice(0, 5)
      setCookie('rememberedAccounts', JSON.stringify(rememberedAccounts.value), {
        days: 30,
        secure: location.protocol === 'https:',
        sameSite: 'Lax',
        path: '/',
      })
    }

    loginAttempts.value = 0
    router.push({ path: '/setup' })
  } catch (err: any) {

     if (err.response?.status === 403) {
      const data = err.response.data

      // Vérifier si c'est une erreur de vérification d'email
      if (data?.error === 'EMAIL_NOT_VERIFIED' || data?.requiresVerification) {
        emailVerificationRequired.value = true
        verificationEmail.value = data.email || email.value
        isLoading.value = false
        return
      }
      error.value = t('accessForbidden')

    }
    //Gestion du 503 (Service Unavailable)
     else if (err.response?.status === 503) {
      error.value = t('serviceUnavailable')

      // Réessai automatique pour les erreurs de service
      if (loginAttempts.value < MAX_LOGIN_ATTEMPTS) {
        setTimeout(() => {
          handleSubmit()
        }, 2000)
        return
      }
    } else if (err.response?.status === 400 && err.response.data?.message === 'Login failed') {
      error.value = t('loginFailedGeneric')
    } else if (err.response?.status === 401) {
      error.value = t('incorrectEmailOrPassword')
    } else if (err.response?.status === 400) {
      error.value = err.response.data?.message || t('invalidRequestData')
    } else if (err.response?.status === 422) {
      error.value = t('validationError')
    } else if (err.response) {
      error.value = t('serverError')
    } else if (err.request) {
      error.value = t('networkError')
    } else {
      error.value = t('unexpectedError')
    }
  } finally {
    isLoading.value = false
  }
}

const backToLogin = () => {
  // Réinitialiser tous les états du reset password
  resetMode.value = false
  resetUsername.value = ''
  resetHotelId.value = ''
  resetVerifyError.value = null
  resetSendError.value = null
  resetSendError.value = null
  isVerifyingReset.value = false
  isSendingReset.value = false
  resetVerified.value = false
  resetSent.value = false

  emailVerificationRequired.value = false
  verificationEmail.value = ''
  verificationResent.value = false
  resendVerificationError.value = null


  // Réinitialiser aussi les champs de login
  email.value = ''
  password.value = ''
  error.value = null
}

const messages = [
  {
    title: t('messag.maximizeRevenue.title'),
    text: t('messag.maximizeRevenue.text'),
  },
  {
    title: t('messag.noOverbooking.title'),
    text: t('messag.noOverbooking.text'),
  },
  {
    title: t('messag.automatedManagement.title'),
    text: t('messag.automatedManagement.text'),
  },
  {
    title: t('messag.goodbyeManualError.title'),
    text: t('messag.goodbyeManualError.text'),
  },
]


const partners = [
  {
    name: 'Booking.com',
    logo: '/images/ota/Booking.com_Logo.svg',
  },
  {
    name: 'Expedia',
    logo: '/images/ota/expedia.svg',
  },
  {
    name: 'Airbnb',
    logo: '/images/ota/Airbnb_Logo_Bélo.svg',
  },
  {
    name: 'Agoda',
    logo: '/images/ota/agoda.svg',
  },
  {
    name: 'Hotels.com',
    logo: '/images/ota/hotels.svg',
  },
  {
    name: 'Trivago',
    logo: '/images/ota/trivago-logo-svg-vector.svg',
  },
]

const resendVerificationEmail = async () => {
  resendVerificationError.value = null
  verificationResent.value = false
  isResendingVerification.value = true

  try {

    await resendEmailVerification(verificationEmail.value)
    verificationResent.value = true
  } catch (err: any) {
    resendVerificationError.value = err?.response?.data?.message || t('unableToResendVerification')
  } finally {
    isResendingVerification.value = false
  }
}

onMounted(() => {
  intervalId = window.setInterval(() => {
    currentMessageIndex.value = (currentMessageIndex.value + 1) % messages.length
  }, 8000)
})

onUnmounted(() => {
  if (intervalId !== null) clearInterval(intervalId)
})
</script>

<style scoped>
.fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
