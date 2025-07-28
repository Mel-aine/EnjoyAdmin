<script setup lang="ts">
import { CalendarIcon } from 'lucide-vue-next'
import { ref, defineAsyncComponent, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'
import { useServiceStore } from '@/composables/serviceStore'
import {
    createUser,
    updateUser,
    getRole,
    getDepartment
} from '@/services/api'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/composables/user'
import { defaultData, type Form } from '@/utils/models'
import { CONTRACTTYPE } from '@/utils/constants'
import InputDatePicker from '../forms/FormElements/InputDatePicker.vue'
import InputEmail from '../forms/FormElements/InputEmail.vue'
import InputPhone from '../forms/FormElements/InputPhone.vue'

const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))
const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'))
const isLoading = ref(false)
const serviceStore = useServiceStore()
const toast = useToast()
const userStore = useAuthStore()
const showPassword = ref(false)
const role = ref<any[]>([])
const departments = ref<any[]>([])
const { t } = useI18n()
const roles = ref<{ value: string; label: string }[]>([])
const emits = defineEmits(['refresh', 'close']);
const isLoadingRole = ref(false);
const isLoadingDepartment = ref(false);
const props = defineProps({
    isEditMode: {
        type: Boolean,
        default: false,
    },
    selectedUser: {
        type: Object,
        default: null,
    },
    modalOpen: {
        type: Boolean,
        default: false
    }
})
const flatpickrConfig = {
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'F j, Y',
    wrap: true,
}
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const form = ref<Form>(defaultData())
const saveUser = async () => {
    isLoading.value = true
    try {
        const serviceId = serviceStore.serviceId

        const selectedRole = roles.value.find((r) => r.value === form.value.roleId)
        const roleLabel = selectedRole ? selectedRole.label : ''
        const userPayload = {
            service_id: serviceId,
            first_name: form.value.firstName,
            last_name: form.value.lastName,
            email: form.value.email,
            phone_number: form.value.phoneNumber,
            role_id: form.value.roleId,
            password: form.value.password,
            department_id: form.value.department,
            hire_date: form.value.hire_date,
            created_by: userStore.UserId,
            last_modified_by: userStore.UserId,
            role: roleLabel,
            date_of_birth: form.value.dateOfBirth,
            place_of_birth: form.value.placeOfBirth,
            gender: form.value.gender,
            city: form.value.city,
            country: form.value.country,
            emergency_phone: form.value.emergencyPhone,
            personal_email: form.value.personalEmail,
            social_security_number: form.value.socialSecurityNumber,
            national_id_number: form.value.nationalIdNumber,
            contract_type: form.value.contractType,
            contract_end_date: form.value.contractEndDate,
            data_processing_consent: form.value.dataProcessingConsent,
            consent_date: form.value.consentDate,

        }

        const response = await createUser(userPayload)
        console.log('response', response)
        if (response.status === 201 || response.status === 200) {
            emits('refresh')
            form.value = defaultData()
            toast.success(t('toast.userCreated'))
        } else {
            toast.error(t('toast.userErrorCreated'))
        }
    } catch (error: any) {
        toast.error(t('toast.userErrorCreated'))
        console.error('❌ Error while saving:', error.response?.data || error.message)
    } finally {
        isLoading.value = false
    }
}

const genders = ref([{ label: t('Male'), value: 'male' }, { label: t('Female'), value: 'female' }]);
const contractTypes = ref([{ label: t('contract_types.cdi'), value: CONTRACTTYPE.CDI },
{ label: t('contract_types.cdd'), value: CONTRACTTYPE.CDD },
{ label: t('contract_types.seasonal'), value: CONTRACTTYPE.SEASONAL },
{ label: t('contract_types.apprenticeship'), value: CONTRACTTYPE.APPRENTICESHIP },
{ label: t('contract_types.temporary_work'), value: CONTRACTTYPE.TEMPORARY },
{ label: t('contract_types.internship'), value: CONTRACTTYPE.INTERN },
])

onMounted(async () => {
    fetchRole()
    fetchDepartment()
})

const fetchRole = async () => {
    isLoadingRole.value = true
    try {
        const serviceId = serviceStore.serviceId
        const response = await getRole(serviceId)
        console.log('role', response.data)
        role.value = response.data
        roles.value = response.data.map((r: any) => {
            return {
                label: r.roleName,
                value: r.id,
            }
        })
        console.log('roles.value', roles.value)
    } catch (error) {
        console.error('fetch failed:', error)
    } finally {
        isLoadingRole.value = false
    }
}




const updateFormData = async () => {
    isLoading.value = true

    try {
        const serviceId = serviceStore.serviceId
        const userId = props.selectedUser?.id
        const selectedRole = roles.value.find((r: any) => r.value === form.value.roleId)
        const roleLabel = selectedRole ? selectedRole.label : ''

        if (!userId) {
            toast.error('Aucun utilisateur sélectionné pour la mise à jour.')
            return
        }

        const userPayload = {
            service_id: serviceId,
            first_name: form.value.firstName,
            last_name: form.value.lastName,
            email: form.value.email,
            phone_number: form.value.phoneNumber,
            role_id: form.value.roleId,
            password: form.value.password,
            created_by: userStore.UserId,
            last_modified_by: userStore.UserId,
            role: roleLabel,
            date_of_birth: form.value.dateOfBirth,
            place_of_birth: form.value.placeOfBirth,
            gender: form.value.gender,
            city: form.value.city,
            country: form.value.country,
            emergency_phone: form.value.emergencyPhone,
            personal_email: form.value.personalEmail,
            social_security_number: form.value.socialSecurityNumber,
            national_id_number: form.value.nationalIdNumber,
            contract_type: form.value.contractType,
            contract_end_date: form.value.contractEndDate,
            data_processing_consent: form.value.dataProcessingConsent,
            consent_date: form.value.consentDate,
            hire_date: form.value.hire_date,
            department_id: form.value.department
        }

        console.log('Payload envoyé :', userPayload)
        await updateUser(userId, userPayload)

        toast.success(t('toast.userUpdatedSuccess'))
        emits('refresh')
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error)
        toast.error(t('toast.updateError'))
    } finally {
        isLoading.value = false
    }
}

const handleSubmit = async () => {
    isLoading.value = true
    try {
        if (props.isEditMode) {
            await updateFormData()
        } else {
            await saveUser()
        }
    } finally {
        isLoading.value = false
    }
}

const closeModal = () => {
    form.value = defaultData()
    emits('close')
}

const fetchDepartment = async () => {
    isLoadingDepartment.value = true
    try {
        const serviceId = serviceStore.serviceId;
        console.log('Service ID:', serviceId);

        const departmentsResponse = await getDepartment(serviceId);
        departments.value = departmentsResponse.data.map((d: any) => {
            return {
                ...d,
                label: d.name,
                value: d.id
            }
        });
        console.log('Departments:', departments.value);


    } catch (error) {
        console.error('Erreur lors de la récupération :', error);
    } finally {
        isLoadingDepartment.value = false
    }
};






onMounted(() => {
    console.log('props.selectedUser', props.selectedUser);
    if (props.selectedUser) {
        form.value.department = props.selectedUser.department?.id
        form.value.firstName = props.selectedUser.first_name ?? props.selectedUser.firstName
        form.value.lastName = props.selectedUser.last_name ?? props.selectedUser.lastName
        form.value.email = props.selectedUser.email ?? props.selectedUser.email
        form.value.phoneNumber = props.selectedUser.phone_number ?? props.selectedUser.phoneNumber
        form.value.roleId = props.selectedUser.role_id ?? props.selectedUser.roleId
        form.value.dateOfBirth = (props.selectedUser.date_of_birth || props.selectedUser.dateOfBirth) ?
            (new Date(props.selectedUser.date_of_birth ?? props.selectedUser.dateOfBirth).toISOString().split('T')[0]) : ''
        form.value.placeOfBirth = props.selectedUser.place_of_birth ?? props.selectedUser.placeOfBirth
        form.value.gender = props.selectedUser.gender
        form.value.city = props.selectedUser.city
        form.value.country = props.selectedUser.country
        form.value.emergencyPhone = props.selectedUser.emergency_phone ?? props.selectedUser.emergencyPhone
        form.value.personalEmail = props.selectedUser.personal_email ?? props.selectedUser.personalEmail
        form.value.socialSecurityNumber = props.selectedUser.social_security_number ?? props.selectedUser.socialSecurityNumber
        form.value.nationalIdNumber = props.selectedUser.national_id_number ?? props.selectedUser.nationalIdNumber
        form.value.contractType = props.selectedUser.contract_type ?? props.selectedUser.contractType
        form.value.contractEndDate = props.selectedUser.contract_end_date ?? props.selectedUser.contractEndDate
        form.value.dataProcessingConsent = props.selectedUser.data_processing_consent ?? props.selectedUser.dataProcessingConsent
        form.value.consentDate = props.selectedUser.consent_date ?? props.selectedUser.consentDate
        if (props.selectedUser.hire_date) {
            const hireDate = new Date(props.selectedUser.hire_date)
            form.value.hire_date = hireDate.toISOString().split('T')[0]
        } else if (props.selectedUser.hireDate) {
            const hireDate = new Date(props.selectedUser.hireDate)
            form.value.hire_date = hireDate.toISOString().split('T')[0]
        }

    }
})

</script>

<template>
    <div>
        <Modal v-if="modalOpen" @close="closeModal()">
            <template #body>
                <div
                    class="no-scrollbar h-11/12 relative w-full max-w-7xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <button @click="closeModal()"
                        class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
                        <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                                fill="" />
                        </svg>
                    </button>
                    <div class="px-2 pr-14">
                        <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {{ isEditMode ? $t('EditUser') : $t('NewUser') }}
                        </h4>
                    </div>
                    <form @submit.prevent="handleSubmit" class="flex flex-col">
                        <div class=" overflow-auto max-h-max  p-2">
                            <div class="space-y-8">
                                <div>
                                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        <Input :lb="$t('FirstName')" :id="'name'" :forLabel="'name'"
                                            v-model="form.firstName" :is-required="true" />

                                        <Input :lb="$t('LastName')" :id="'last'" :forLabel="'last'"
                                            v-model="form.lastName" :is-required="true" />

                                        <!-- gender-->
                                        <Select :is-required="true" :lb="$t('gender')" v-model="form.gender"
                                            :options="genders" />
                                        <InputPhone :is-required="true" v-model="form.phoneNumber" :id="'phone'"
                                            :title="$t('Phone')" />

                                        <!--emergency phone-->
                                        <InputPhone :is-required="true" v-model="form.emergencyPhone" :id="'emergencyPhone'"
                                            :title="$t('emergencyPhone')" />
                                        <!--email-->

                                        <InputEmail :is-required="true" v-model="form.email"
                                            placeholder="info@gmail.com" :title="$t('Email')" />
                                        <!--personnal Email-->
                                        <InputEmail :is-required="false" v-model="form.personalEmail"
                                            placeholder="info@gmail.com" :title="$t('personalEmail')" />
                                        <!-- user birth day-->
                                        <InputDatePicker v-model="form.dateOfBirth" :is-required="true"
                                            :title="$t('dateOfBirth')" :placeholder="$t('dateOfBirth')" />

                                        <!-- place of birth-->
                                        <Input :lb="$t('placeOfBirth')" :id="'placeOfBirth'" :forLabel="'placeOfBirth'"
                                            v-model="form.placeOfBirth" :is-required="true" />

                                        <!--city-->
                                        <Input :lb="$t('city')" :id="'last'" :forLabel="'last'" v-model="form.city"
                                            :is-required="true" />
                                        <!--Country-->
                                        <Input :lb="$t('country')" :id="'last'" :forLabel="'last'"
                                            v-model="form.country" :is-required="true" />

                                        <Input :lb="$t('socialSecurityNumber')" :id="'socialSecurityNumber'"
                                            :forLabel="'socialSecurityNumber'" :inputType="'text'"
                                            v-model="form.socialSecurityNumber" />
                                        <Input :lb="$t('nationalIdNumber')" :id="'nationalIdNumber'"
                                            :forLabel="'nationalIdNumber'" :inputType="'text'" :is-required="true"
                                            v-model="form.nationalIdNumber" />
                                        <!--contract_type-->
                                        <Select :is-required="true" :lb="$t('contractType')" v-model="form.contractType"
                                            :options="contractTypes" />
                                        <InputDatePicker v-if="form.contractType !== CONTRACTTYPE.CDI" min-date='today'
                                            v-model="form.contractEndDate" :is-required="true"
                                            :title="$t('contractEndDate')" :placeholder="$t('Selectdate')" />

                                        <InputDatePicker v-model="form.consentDate" :is-required="true" min-date='today'
                                            :title="$t('consentDate')" :placeholder="$t('Selectdate')" />

                                        <div v-if="!isEditMode">
                                            <label for="password"
                                                class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                                {{ $t('Password') }} <span class="text-red-500">*</span>
                                            </label>
                                            <div class="relative">
                                                <input v-model="form.password"
                                                    :type="showPassword ? 'text' : 'password'" id="password"
                                                    autocomplete="current-password" is-required="true"
                                                    :placeholder="$t('Enteryourpassword')"
                                                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800" />
                                                <span @click="togglePasswordVisibility"
                                                    class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400">
                                                    <svg v-if="!showPassword" class="fill-current" width="20"
                                                        height="20" viewBox="0 0 20 20" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                            d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                                                            fill="#98A2B3" />
                                                    </svg>
                                                    <svg v-else class="fill-current" width="20" height="20"
                                                        viewBox="0 0 20 20" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                            d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                                                            fill="#98A2B3" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>



                                        <Select :is-required="true" :lb="$t('Role')" v-model="form.roleId"
                                            :options="roles" :is-loading="isLoadingRole" />
                                        <Select :is-required="true" :lb="$t('staffManager.department')"
                                            v-model="form.department" :is-loading="isLoadingDepartment"
                                            :options="departments" />
                                        <InputDatePicker v-model="form.hire_date" :is-required="true" max-date="today"
                                            :title="$t('staffManager.hireDate')" :placeholder="$t('Selectdate')" />

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <button @click="closeModal()" type="button"
                                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                                :disabled="isLoading">
                                {{ $t('Cancel') }}
                            </button>
                            <button type="submit" :disabled="isLoading"
                                class="relative flex w-full justify-center items-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 transition disabled:opacity-50 sm:w-auto">
                                <span v-if="!isLoading"> {{ isEditMode ? $t('EditUser') : $t('Save') }}</span>
                                <span v-else class="flex items-center gap-2">
                                    <Spinner class="w-4 h-4" />
                                    {{ $t('Processing') }}...
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </template>
        </Modal>
    </div>
</template>
