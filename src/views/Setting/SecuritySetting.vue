<template>
  <div class="security-settings">
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">{{ t('SecuritySettings') }}</h2>
      <p class="text-gray-600 mb-6">{{ t('Manageyour') }}</p>
    </div>

    <div class="space-y-6">
      <!-- Password Management -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h3 class="text-lg font-medium mb-4">{{ t('PasswordManagement') }}</h3>

        <div v-if="!changingPassword" class="mb-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium">{{ t('Password') }}</h4>
              <p class="text-xs text-gray-500">{{ t('Last changed') }}: {{ passwordLastChanged }}</p>
            </div>
            <button
              @click="changingPassword = true"
              class="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
            >
              {{ t('ChangePassword') }}
            </button>
          </div>
        </div>

        <div v-else class="mb-4">
          <form class="space-y-3">
            <div>
              <Input :lb="t('CurrentPassword')" :inputType="'password'" v-model="passwordForm.currentPassword" :id="'pass'" :forLabel="'pass'"/>
            </div>
            <div>
              <Input :lb="t('NewPassword')" :inputType="'password'"   v-model="passwordForm.newPassword" :id="'pass1'" :forLabel="'pass1'"/>
            </div>
            <div>
              <Input :lb="t('ConfirmNewPassword')" :inputType="'password'"  v-model="passwordForm.confirmPassword" :id="'pass11'" :forLabel="'pass11'"/>
            </div>

            <!-- Password strength indicator -->
            <div v-if="passwordForm.newPassword">
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('PasswordStrength') }}</label>
              <div class="h-2 w-full bg-gray-200 rounded-full">
                <div
                  :class="['h-2 rounded-full', passwordStrengthColor]"
                  :style="{ width: `${passwordStrength * 25}%` }"
                ></div>
              </div>
              <p class="text-xs mt-1" :class="passwordStrengthTextColor">
                {{ passwordStrengthText }}
              </p>
            </div>
          </form>
            <div class="flex space-x-3 mt-4">
              <button
                @click.prevent="changePassword"
                class="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                :disabled="!isPasswordFormValid"
              >
                <span v-if="!isLoading">  {{ t('UpdatePassword') }} </span>
                <span v-else class="flex items-center gap-2">
                  <Spinner class="w-4 h-4" />
                  {{ $t('Processing') }}...
                </span>
              </button>
              <button
                @click="cancelPasswordChange"
                class="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                {{ t('Cancel') }}
              </button>
            </div>

        </div>

        <div class="mt-2">
          <h4 class="text-sm font-medium mb-2">{{ t('PasswordRequirements') }}</h4>
          <ul class="text-xs text-gray-600 space-y-1 ml-5 list-disc">
            <li>{{ t('long') }}</li>
            <li>{{ t('uppercaseLetter') }}</li>
            <li>{{ t('lowercase') }}</li>
            <li>{{ t('oneNumber') }}</li>
            <li>{{ t('specialCharacter') }}</li>
          </ul>
        </div>
      </div>

      <!-- Two-Factor Authentication -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-medium">{{ t('Two-FactorAuthentication') }}</h3>
            <p class="text-sm text-gray-600">{{ t('addAn') }}</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="twoFactorEnabled"
              class="sr-only peer"
              @change="toggleTwoFactor"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div v-if="twoFactorEnabled" class="space-y-4">
          <div class="bg-white p-4 border border-gray-200 rounded-md">
            <h4 class="text-sm font-medium mb-2">{{ t('AuthenticationMethods') }}</h4>

            <div class="space-y-3">
              <div class="flex items-center">
                <input
                  id="method-app"
                  type="radio"
                  v-model="twoFactorMethod"
                  value="app"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
                <label for="method-app" class="ml-2 block text-sm">
                  {{ t('AuthenticatorApp') }}
                </label>

              </div>

              <div class="flex items-center">
                <input
                  id="method-sms"
                  type="radio"
                  v-model="twoFactorMethod"
                  value="sms"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label for="method-sms" class="ml-2 block text-sm">
                  {{ t('SMSTextMessage') }}
                </label>
              </div>

              <div class="flex items-center">
                <input
                  id="method-email"
                  type="radio"
                  v-model="twoFactorMethod"
                  value="email"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label for="method-email" class="ml-2 block text-sm">
                  {{ t('EmailAuthentication') }}
                </label>
              </div>
            </div>
          </div>

          <div class="bg-white p-4 border border-gray-200 rounded-md">
            <div v-if="twoFactorMethod === 'app'">
              <h4 class="text-sm font-medium mb-2">{{ t('AuthenticatorAppSetup') }}</h4>

              <div class="flex flex-col items-center justify-center mb-4">
                <div class="bg-gray-100 w-48 h-48 flex items-center justify-center mb-2">
                  <!-- Placeholder for QR code -->
                  <span class="text-xs text-gray-500">{{ t('QRCodePlaceholder') }}</span>
                </div>
                <p class="text-xs text-gray-600">{{ t('scan') }}</p>
              </div>

              <div class="mb-4">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ t('ManualEntryCode') }}</label>
                <div class="flex justify-between gap-2">
                  <input
                    type="text"
                    value="ABCD-EFGH-IJKL-MNOP"
                    readonly
                    class="flex-1 dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  />

                  <button
                    class="px-2 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    <span class="text-xs">{{ t('Copy') }}</span>
                  </button>
                </div>
              </div>

              <div class="mb-4">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ t('VerificationCode') }}</label>
                <input
                  type="text"
                  v-model="verificationCode"
                  placeholder="Enter 6-digit code"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                />
              </div>

              <button
                @click="verifyTwoFactor"
                class="px-3 py-2 bg-purple-300 text-white rounded-md text-sm hover:bg-purple-400 w-full"
              >
                {{ t('VerifyandActivate') }}
              </button>
            </div>

            <div v-else-if="twoFactorMethod === 'sms'">
              <h4 class="text-sm font-medium mb-2">{{ t('SMSAuthenticationSetup') }}</h4>

              <div class="mb-4">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ t('PhoneNumber') }}</label>
                <input
                  type="tel"
                  v-model="phoneNumber"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                />
              </div>

              <button
                @click="sendVerificationCode"
                class="px-3 py-2 bg-purple-300 text-white rounded-md text-sm hover:bg-purple-400 w-full mb-4"
              >
                {{ t('SendVerificationCode') }}
              </button>

              <div v-if="codeSent" class="mb-4">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ t('VerificationCode') }}</label>
                <input
                  type="text"
                  v-model="verificationCode"
                  placeholder="Enter 6-digit code"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                />

                <button
                  @click="verifyTwoFactor"
                  class="px-3 py-2 bg-purple-300 text-white rounded-md text-sm hover:bg-purple-400 w-full mt-2"
                >
                  {{ t('VerifyandActivate') }}
                </button>
              </div>
            </div>

            <div v-else-if="twoFactorMethod === 'email'">
              <h4 class="text-sm font-medium mb-2">{{ t('EmailAuthenticationSetup') }}</h4>

              <div class="mb-4">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ t('EmailAddress') }}</label>
                <input
                  type="email"
                  v-model="emailForTwoFactor"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  readonly
                />
                <p class="text-xs text-gray-500 mt-1">
                  {{ t('we...') }}
                </p>
              </div>

              <button
                @click="sendVerificationCode"
                class="px-3 py-2 bg-purple-300 text-white rounded-md text-sm hover:bg-purple-400 w-full mb-4"
              >
                {{ t('SendVerificationCode') }}
              </button>

              <div v-if="codeSent" class="mb-4">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ t('VerificationCode') }}</label>
                <input
                  type="text"
                  v-model="verificationCode"
                  placeholder="Enter 6-digit code"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                />

                <button
                  @click="verifyTwoFactor"
                  class="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 w-full mt-2"
                >
                  {{ t('VerifyandActivate') }}
                </button>
              </div>
            </div>
          </div>

          <div class="bg-white p-4 border border-gray-200 rounded-md">
            <h4 class="text-sm font-medium mb-2">{{ t('RecoveryCodes') }}</h4>
            <p class="text-xs text-gray-600 mb-3">
              {{ t('save...') }}
            </p>

            <div class="bg-gray-50 p-3 rounded-md mb-3 grid grid-cols-2 gap-2">
              <div v-for="(code, index) in recoveryCodes" :key="index" class="text-xs font-mono">
                {{ code }}
              </div>
            </div>

            <div class="flex space-x-2">
              <button
                @click="downloadRecoveryCodes"
                class="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex-1"
              >
                {{ t('Download') }}
              </button>
              <button
                @click="copyRecoveryCodes"
                class="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex-1"
              >
                {{ t('CopyAll') }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-sm text-gray-600">
          <p>{{ t('two...') }}</p>
        </div>
      </div>

      <!-- Security Log -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h3 class="text-lg font-medium mb-3">{{ t('SecurityLog') }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ t('recent') }}</p>

        <div class="mb-4 overflow-hidden border border-gray-200 rounded-md">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('Event') }}
                </th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('IPAddress') }}
                </th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('Location') }}
                </th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('Date') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(event, index) in securityEvents" :key="index">
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div class="flex items-center">
                    <div :class="['h-2 w-2 rounded-full mr-2', event.type === 'success' ? 'bg-green-500' : 'bg-red-500']"></div>
                    {{ event.event }}
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {{ event.ip }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {{ event.location }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {{ event.date }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          class="text-sm text-blue-600 hover:text-blue-800"
        >
          {{ t('ViewFullSecurityLog') }}
        </button>
      </div>

      <!-- Connected Sessions -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h3 class="text-lg font-medium mb-3">{{ t('ActiveSessions') }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ t('devices') }}</p>

        <div class="space-y-3">
          <div v-for="(session, index) in activeSessions" :key="index" class="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-md">
            <div class="flex items-center">
              <div class="bg-blue-100 p-2 rounded-md mr-3">
                <span v-if="session.device === 'Desktop'" class="text-blue-600">💻</span>
                <span v-else-if="session.device === 'Mobile'" class="text-blue-600">📱</span>
                <span v-else class="text-blue-600">🌐</span>
              </div>
              <div>
                <h4 class="text-sm font-medium">{{ session.device }} - {{ session.browser }}</h4>
                <p class="text-xs text-gray-500">{{ session.location }} • {{ session.ip }}</p>
                <p class="text-xs text-gray-500">{{ t('Last active') }}: {{ session.lastActive }}</p>
              </div>
            </div>
            <div>
              <button
                v-if="!session.current"
                @click="terminateSession(index)"
                class="text-sm text-red-600 hover:text-red-800"
              >
                {{ t('Terminate') }}
              </button>
              <span v-else class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                {{ t('Current') }}
              </span>
            </div>
          </div>
        </div>

        <button
          @click="terminateAllSessions"
          class="mt-4 px-4 py-2 bg-red-50 text-red-600 border border-transparent rounded-md text-sm hover:bg-red-100"
        >
          {{ t('SignOutFromAllDevices') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed,defineAsyncComponent } from 'vue';
import { useToast } from 'vue-toastification'
import { user_update } from '@/services/api'
import { useAuthStore } from '@/composables/user'
import { useI18n } from 'vue-i18n';

const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'));
const Spinner = defineAsyncComponent(() => import('@/components/spinner/Spinner.vue'));

const { t } = useI18n();
const toast = useToast()
const authStore = useAuthStore()
const passwordLastChanged = ref('January 15, 2025');
const isLoading = ref(false)
const changingPassword = ref(false);
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Password strength
const passwordStrength = computed(() => {
  const pwd = passwordForm.value.newPassword;
  if (!pwd) return 0;

  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (/[A-Z]/.test(pwd)) strength++;
  if (/[a-z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd)) strength++;
  if (/[^A-Za-z0-9]/.test(pwd)) strength++;

  return Math.min(strength, 4);
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 0) return t('Very Weak');
  if (strength === 1) return t('Weak');
  if (strength === 2) return t('Fair');
  if (strength === 3) return t('Good');
  return t('Strong');
});

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 1) return 'bg-red-500';
  if (strength === 2) return 'bg-yellow-500';
  if (strength === 3) return 'bg-green-500';
  return 'bg-green-600';
});

const passwordStrengthTextColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 1) return 'text-red-500';
  if (strength === 2) return 'text-yellow-500';
  if (strength === 3) return 'text-green-500';
  return 'text-green-600';
});

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.currentPassword &&
    passwordForm.value.newPassword &&
    passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
    passwordStrength.value >= 3
  );
});

// const changePassword = async() => {
//   if (isPasswordFormValid.value) {

//     console.log('Password changed successfully');
//     passwordLastChanged.value = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
//     changingPassword.value = false;
//     resetPasswordForm();
//     alert(t('Password changed successfully!'));
//   } else {
//     alert(t('Please check your password inputs'));
//   }
// };


const changePassword = async () => {
  const id = authStore.UserId;
  if (isPasswordFormValid.value) {
    const userData = {
      password: passwordForm.value.newPassword,
      password_confirmation: passwordForm.value.confirmPassword,
    };
    const token = localStorage.getItem('token');

    try {
      console.log('Payload envoyé à l’API :', userData);
      await user_update(id, userData, token);


      console.log('Password changed successfully');
      passwordLastChanged.value = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      changingPassword.value = false;
      resetPasswordForm();

      toast.success(t('toast.SucessUpdate'));
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(t('toast.updateError'));
    }
  } else {
    toast.error(t('toast.updateError'));
  }
};



const cancelPasswordChange = () => {
  changingPassword.value = false;
  resetPasswordForm();
};

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
};

// Two-factor authentication
const twoFactorEnabled = ref(false);
const twoFactorMethod = ref('app');
const verificationCode = ref('');
const phoneNumber = ref('');
const emailForTwoFactor = ref('john.doe@example.com');
const codeSent = ref(false);

const recoveryCodes = ref([
  'ABCD-1234-EFGH', 'IJKL-5678-MNOP',
  'QRST-9012-UVWX', 'YZ12-3456-7890',
  'ABCD-7890-EFGH', 'IJKL-1234-MNOP',
  'QRST-5678-UVWX', 'YZ12-9012-3456'
]);

const toggleTwoFactor = () => {
  if (!twoFactorEnabled.value) {
    // Simply toggle the UI state - in real app you'd have API calls
    console.log('Two-factor authentication setup started');
  } else {
    // Disable 2FA (would require confirmation in a real app)
    console.log('Two-factor authentication disabled');
    codeSent.value = false;
  }
};

const sendVerificationCode = () => {
  // Simulate sending verification code
  console.log(`Sending verification code to ${twoFactorMethod.value === 'sms' ? phoneNumber.value : emailForTwoFactor.value}`);
  codeSent.value = true;
  alert(t('Verification code sent!'));
};

const verifyTwoFactor = () => {
  // Verify the code would be done via API
  if (verificationCode.value.length === 6) {
    console.log('Two-factor authentication enabled');
    alert(t('Two-factor authentication enabled successfully!'));
  } else {
    alert(t('Please enter a valid 6-digit code'));
  }
};

const downloadRecoveryCodes = () => {
  // In a real app, this would generate a file download
  console.log('Downloading recovery codes');
  alert(t('Recovery codes downloaded!'));
};

const copyRecoveryCodes = () => {
  // In a real app, this would copy to clipboard
  console.log('Copying recovery codes to clipboard');
  alert(t('Recovery codes copied to clipboard!'));
};

// Security log
const securityEvents = ref([
  {
    event: t('Successful login'),
    ip: '192.168.1.1',
    location: 'Paris, France',
    date: '2025-05-05 09:23:12',
    type: 'success'
  },
  {
    event: t('Failed login attempt'),
    ip: '203.0.113.1',
    location: 'Unknown',
    date: '2025-05-03 22:15:47',
    type: 'error'
  },
  {
    event: t('Password changed'),
    ip: '192.168.1.1',
    location: 'Paris, France',
    date: '2025-01-15 14:30:22',
    type: 'success'
  }
]);

// Active sessions
const activeSessions = ref([
  {
    device: 'Desktop',
    browser: 'Chrome',
    location: 'Paris, France',
    ip: '192.168.1.1',
    lastActive: 'Now',
    current: true
  },
  {
    device: 'Mobile',
    browser: 'Safari',
    location: 'Paris, France',
    ip: '192.168.1.100',
    lastActive: '1 hour ago',
    current: false
  },
  {
    device: 'Tablet',
    browser: 'Firefox',
    location: 'Lyon, France',
    ip: '203.0.113.42',
    lastActive: '2 days ago',
    current: false
  }
]);

const terminateSession = (index: number) => {
  // In a real app, this would call an API to terminate the session
  activeSessions.value.splice(index, 1);
  console.log(`Session ${index} terminated`);
  alert(t('Session terminated successfully!'));
};

const terminateAllSessions = () => {
  // In a real app, this would call an API to terminate all sessions except current
  activeSessions.value = activeSessions.value.filter((session:any) => session.current);
  console.log('All other sessions terminated');
  alert(t('Signed out from all other devices!'));
};
</script>
