<template>
    <admin-layout>
        <PageBreadcrumb :pageTitle="$t('userProfile')" />
        <FullScreenLayout>
        <div class="" v-if="user && user.id"> 
            <ModalConfirmation v-if="showTerminationModal" @close="showTerminationModal = false" @confirm="handleConfirmTermination" :isLoading="isTerminating" :action="'DANGER'" :title="$t('contract.break')" :message="$t('contract.break_confirmation') + ' ' + user.firstName + user.firstName + ' '  + ' ?'" />
            <Modal v-if="isCreateContractModalOpen" @close="isCreateContractModalOpen = false">
                <template #body>
                <div
                    class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <button @click="isCreateContractModalOpen = false"
                    class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
                    <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                        fill="" />
                    </svg>
                    </button>
                    <h2 class="text-lg font-semibold mb-4">{{ contractFormAction == "CREATE" ? $t('new') : $t('edit') }}</h2>
                    <form @submit.prevent="handleAssignContract">
                        <div class="mb-4">
                            <InputDatePicker v-model="contractInfoFormData.probation_start_date" :is-required="true" @clear-error="contractInfoFormData.probation_start_date_error = ''"
                                            :title="$t('probation_start_date')" />
                                <div v-if="contractInfoFormData.probation_start_date_error" class="text-red-500 text-sm italic">
                                    {{ contractInfoFormData.probation_start_date_error }}
                                </div>
                        </div>

                        <div class="mb-4">
                            <InputDatePicker v-model="contractInfoFormData.probation_end_date" :is-required="true"
                                @clear-error="contractInfoFormData.probation_end_date_error = ''"
                                :title="$t('probation_end_date')"
                            />
                                <div v-if="contractInfoFormData.probation_end_date_error" class="text-red-500 text-sm italic">
                                    {{ contractInfoFormData.probation_end_date_error }}
                                </div>
                        </div>

                        <div class="mb-4">
                            <InputDatePicker v-model="contractInfoFormData.contract_start_date" :is-required="true"
                                @clear-error="contractInfoFormData.contract_start_date_error = ''"
                                :title="$t('contract_start_date')"
                            />
                                <div v-if="contractInfoFormData.contract_start_date_error" class="text-red-500 text-sm italic">
                                    {{ contractInfoFormData.contract_start_date_error }}
                                </div>
                        </div>


                        <div class="mb-4">
                            <label for="nonRefundableRateEnabled" class="flex items-center cursor-pointer">
                            <span class="text-gray-700 font-medium">{{ $t('is_cdi') }}</span>&nbsp;&nbsp;&nbsp;
                            <input
                                type="checkbox"
                                id="nonRefundableRateEnabled"
                                name="nonRefundableRateEnabled"
                                v-model="contractInfoFormData.is_cdi"
                                class="form-checkbox h-5 w-5 text-purple-600 rounded"
                            />
                            </label>
                        </div>

                        <div class="mb-4" v-if="!contractInfoFormData.is_cdi">
                            <InputDatePicker v-model="contractInfoFormData.contract_end_date_error" :is-required="true"
                                @clear-error="contractInfoFormData.contract_end_date_error = ''"
                                :title="$t('contract_end_date')"
                            />
                                <div v-if="contractInfoFormData.contract_end_date_error" class="text-red-500 text-sm italic">
                                    {{ contractInfoFormData.contract_end_date_error }}
                                </div>
                        </div>

                        <div class="mb-4">
                            <InputCurrency type="number" v-model.number="contractInfoFormData.base_salary"
                                :placeholder="t('base_salary')" />
                        </div>

                        <div class="mb-4">
                            <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                {{ $t('contract_file_path') }}
                            </label>
                            
                            <FileInput @change="handleFileUpload"/>
                            <div
                                v-if="contractInfoFormData.contract_file_path_error"
                                class="text-red-500 text-sm font-light italic"
                            >
                                {{ contractInfoFormData.contract_file_path_error }}
                            </div>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3">
                            <button
                            @click="isCreateContractModalOpen = false"
                            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                            {{ $t('Cancel') }}
                            </button>
                            <button
                            type="submit"
                            class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                            >
                            <span v-if="!isLoading"> {{ $t('Action.save') }}</span>
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
            <Modal v-if="isAddPayrollModalOpen" @close="closeAddPayrollModal">
                <template #body>
                    <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                        <button @click="closeAddPayrollModal" class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
                            <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" fill="" />
                            </svg>
                        </button>
                        <h2 class="text-lg font-semibold mb-4">{{ $t('payroll.add_new') }}</h2>
                        <form @submit.prevent="handleCreatePayroll">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Mois / Année -->
                                <div>
                                <InputDatePicker
                                    v-model="payrollForm.monthYear"
                                    :is-required="true"
                                    :title="$t('monthYear')"
                                    @clear-error="payrollForm.monthYear_error = ''"
                                />
                                <div v-if="payrollForm.monthYear_error" class="text-red-500 text-sm italic">
                                    {{ payrollForm.monthYear_error }}
                                </div>
                                </div>

                                <!-- Salaire brut -->
                                <div>
                                <InputCurrency
                                    v-model="payrollForm.grossSalary"
                                    :lb="$t('grossSalary')"
                                    :placeholder="$t('grossSalary')"
                                />
                                <div v-if="payrollForm.grossSalary_error" class="text-red-500 text-sm italic">
                                    {{ payrollForm.grossSalary_error }}
                                </div>
                                </div>

                                <!-- Heures normales -->
                                <div>
                                <Input
                                    inputType="number"
                                    v-model.number="payrollForm.normalHours"
                                    :lb="$t('normalHours')"
                                    :isRequired="true"
                                    @clear-error="payrollForm.normalHours_error = ''"
                                />
                                <div v-if="payrollForm.normalHours_error" class="text-red-500 text-sm italic">
                                    {{ payrollForm.normalHours_error }}
                                </div>
                                </div>

                                <!-- Heures supplémentaires -->
                                <div>
                                <Input
                                    inputType="number"
                                    v-model.number="payrollForm.overtimeHours"
                                    :lb="$t('overtimeHours')"
                                    @clear-error="payrollForm.overtimeHours_error = ''"
                                />
                                <div v-if="payrollForm.overtimeHours_error" class="text-red-500 text-sm italic">
                                    {{ payrollForm.overtimeHours_error }}
                                </div>
                                </div>

                                <!-- Paiement des heures supp -->
                                <div>
                                <InputCurrency
                                    v-model="payrollForm.overtimePay"
                                    :lb="$t('overtimePay')"
                                />
                                <div v-if="payrollForm.overtimePay_error" class="text-red-500 text-sm italic">
                                    {{ payrollForm.overtimePay_error }}
                                </div>
                                </div>

                                <!-- Primes -->
                                <div>
                                <InputCurrency
                                    v-model="payrollForm.bonuses"
                                    :lb="$t('bonuses')"
                                />
                                <div v-if="payrollForm.bonuses_error" class="text-red-500 text-sm italic">
                                    {{ payrollForm.bonuses_error }}
                                </div>
                                </div>

                                <!-- Indemnités -->
                                <div>
                                <InputCurrency
                                    v-model="payrollForm.allowances"
                                    :lb="$t('allowances')"
                                />
                                <div v-if="payrollForm.allowances_error" class="text-red-500 text-sm italic">
                                    {{ payrollForm.allowances_error }}
                                </div>
                                </div>

                                <!-- CNPS -->
                                <div>
                                <InputCurrency
                                    v-model="payrollForm.cnpsContributions"
                                    :lb="$t('cnpsContributions')"
                                />
                                <div v-if="payrollForm.cnpsContributions_error" class="text-red-500 text-sm italic">
                                    {{ payrollForm.cnpsContributions_error }}
                                </div>
                                </div>

                                <!-- Impôts -->
                                <div>
                                <InputCurrency
                                    v-model="payrollForm.withheldTaxes"
                                    :lb="$t('withheldTaxes')"
                                />
                                <div v-if="payrollForm.withheldTaxes_error" class="text-red-500 text-sm italic">
                                    {{ payrollForm.withheldTaxes_error }}
                                </div>
                                </div>

                                <!-- Salaire net -->
                                <div>
                                    <InputCurrency
                                        v-model="payrollForm.netSalary"
                                        :disabled="true"
                                        :lb="$t('netSalary')"
                                    />
                                    <div v-if="payrollForm.netSalary_error" class="text-red-500 text-sm italic">
                                        {{ payrollForm.netSalary_error }}
                                    </div>
                                </div>
                            </div>

                            <!-- Boutons -->
                            <div class="flex justify-end space-x-3 mt-6">
                                <button
                                type="button"
                                @click="isAddPayrollModalOpen = false"
                                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                {{ $t('Cancel') }}
                                </button>

                                <button
                                type="submit"
                                class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                                >
                                <span v-if="!isLoading">{{ $t('Action.save') }}</span>
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
            <div
                class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    {{ $t('profile') }}
                </h3>
                <profile-card :full-name="fullName" :email="email">
                    <template v-slot:Setting>
                        <div class="flex items-center gap-2">
                            <span>{{ $t('status') }}: <span
                                    :class="`${getStatusColor(user.status)} px-1 rounded-2xl text-sm py-1`">{{
                                        $t(user.status ?? '') }}</span></span>
                            <span>{{ $t('roles') }}: <span
                                    :class="`${getRoleBadge(user.role).bg} ${getRoleBadge(user.role).text} px-1 text-sm rounded-2xl py-1`">{{
                                        $t(user.role) }}</span></span>
                            <span>{{ $t('department') }}: <span
                                    :class="`${getRoleBadge(user.department?.name ?? '').bg} ${getRoleBadge(user.department?.name ?? '').text} px-1 text-sm rounded-2xl py-1`">{{
                                        $t(user.department?.name ?? '') }}</span></span>

                        </div>

                    </template>
                </profile-card>

                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                            'py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200',
                            activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        ]">
                            <div class="flex items-center space-x-2">
                                <component :is="tab.icon" class="w-5 h-5" />
                                <span>{{ tab.label }}</span>
                            </div>
                        </button>
                    </nav>
                </div>
                <!-- Content -->
                <div class="p-6">
                    <!-- Details Tab -->
                    <div v-if="activeTab === 'details'" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <!-- Informations de base -->
                        <personal-info-card :user="user" @update-profile="editUser" />

                        <!-- contact info -->
                        <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                        {{ $t('customerDetails.contactInfo.title') }}
                                    </h4>

                                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-20">
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('customerDetails.contactInfo.email') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                                user.email
                                                }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('personalEmail') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                                user.personalEmail
                                                }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('customerDetails.contactInfo.phone') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ user.
                                                phoneNumber
                                                }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('emergencyPhone') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ user.
                                                emergencyPhone
                                                }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('customerDetails.contactInfo.address') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                                user.address ?? 'N/A'
                                                }}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Contract Info-->
                        <div class="p-5 mb-6 border w border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                            <div v-if="!user.recentContract">
                                <div class="">
                                    <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">{{
                                        $t('assignContractTitle') }}</h2>

                                    <div class="text-center mb-15">
                                        <p class="text-gray-600 text-sm leading-relaxed">{{ $t('contractAssignmentDescription') }}
                                        </p>
                                    </div>

                                    <button @click="isCreateContractModalOpen=true"
                                            class="w-full bg-primary hover:bg-primary/85 text-white font-bold py-3 px-4 rounded-lg
                transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                        {{ $t('assignContractButton') }}
                                    </button>
                                </div>
                            </div>
                            <div class="flex  gap-6 justify-between" v-else>
                                <div class="w-full">
                                    <div class="flex justify-between items-start sm:items-center mb-2 lg:mb-6">
                                        <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 ">
                                            {{ $t('contract_info') }}
                                        </h4>
                                        <div class="flex justify-end gap-3">
                                            <button type="button" @click="editContract" class="flex items-center dark:text-white">
                                                <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" />
                                                </svg>
                                                <!-- {{ $t('edit') }} -->
                                            </button>

                                            <button type="button" @click="showTerminationModal = true" class="text-red-500 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                                <!-- {{ $t('Terminate') }} -->
                                            </button>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-20">
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('hireDate') }}
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                                user.hireDate }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('contractType') }}
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                                (user.contractType) }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('contractStartDate') }}
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                               contractInfo.contract_start_date }}</p>
                                        </div>
                                        <div v-if="!user.recentContract.isCdi">
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('contractEndDate') }}
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                               contractInfo.contract_end_date ?? 'N/A' }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('base_salary') }}
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                               contractInfo.base_salary ?? '0' }} XFA</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('status') }}
                                            </p>
                                            <p :class="`${getStatusColor(user.recentContract.status)} rounded-2xl text-sm py-1 px-2 w-fit`">{{
                                               contractInfo.status ?? 'N/A' }}</p>
                                        </div>
                                        <!-- <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('status') }}
                                            </p>
                                            <p>

                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>

                                            </p>
                                        </div> -->

                                        <!-- <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{
                                                $t('dataProcessingConsent') }}
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                                <input type="checkbox" v-model="user.dataProcessingConsent" />
                                            </p>
                                        </div> -->
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- History Tab -->
                    <div v-if="activeTab === 'history'" class="bg-white rounded-xl border border-gray-200">
                        <template v-if="user.
                            activityLogs && user.activityLogs.length > 0">
                            <ActivitiesLogs :activity-logs="user.activityLogs" />
                        </template>
                        <template v-else>
                            <div class="flex flex-col items-center justify-center text-gray-500 py-10">
                                <FileSearch class="w-12 h-12 mb-3 text-gray-400" />
                                <p class="text-sm">{{ $t('no_recente_activity') }}</p>
                            </div>
                        </template>
                    </div>

                    <!-- Calendar Tab -->
                    <div v-if="activeTab === 'calendar'" class="bg-white rounded-xl border border-gray-200">

                    </div>

                    <!-- Payroll Tab -->
                    <div v-if="activeTab === 'payroll'">
                         <TableComponent 
                            :items="payrollTitles" 
                            :datas="payrollsForTable" 
                            :loading="payrollLoading"
                            :title="$t('payrolls')" 
                            :pagination="true"
                            @downloadPayslip="downloadPayslip"
                            :showButtonAllElement="true"
                         >
                            <template v-slot:headerActions>
                                <div class="flex justify-end  gap-2">

                                <button @click="openAddPayrollModal"
                                    class="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition flex items-center">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    {{ $t('add') }}
                                </button>
                                </div>

                            </template>
                         </TableComponent>
                    </div>
                </div>
                <!-- <address-card /> -->
                <OverLoading v-if="isLoading" />
            </div>
        </div>
        </FullScreenLayout>
    </admin-layout>
    <template v-if="modalOpen">
        <UserUpsertModal :is-edit-mode="true" :selected-user="selectedUser" :modal-open="modalOpen" @close="closeModal"
            @refresh="refresh()" />
    </template>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, ref, onMounted, watch } from 'vue'
import { createContract, getEmployeesDetails, terminateContract, updateContract, getPayrollsByContractId, createPayroll } from '@/services/api'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import InfoIcon from '@/icons/InfoIcon.vue'
import CalendarIcon from '@/icons/CalendarIcon.vue'
import { Bookmark, ClockIcon, CreditCard, FileSearch } from 'lucide-vue-next'
import UserUpsertModal from '@/components/modal/UserUpsertModal.vue'
import Spinner from '@/components/spinner/Spinner.vue'
import ActivitiesLogs from '../Setting/ActivitiesLogs.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import Modal from '@/components/profile/Modal.vue'
import type { IContract, IContractFormData, IPayroll, IPayrollFormData, ICreatePayroll } from '@/types/type'
import Input from '@/components/forms/FormElements/Input.vue'
import { useToast } from 'vue-toastification';
import OverLoading from '@/components/spinner/OverLoading.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { uploadToCloudinary } from '@/utils'
import FileInput from '@/components/forms/FormElements/FileInput.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import InputCurrency from '@/components/forms/FormElements/InputCurrency.vue'
import TableComponent from '@/components/tables/TableComponent.vue'

const AdminLayout = defineAsyncComponent(() => import('../../components/layout/AdminLayout.vue'))
const PageBreadcrumb = defineAsyncComponent(() => import('@/components/common/PageBreadcrumb.vue'))
const ProfileCard = defineAsyncComponent(() => import('../../components/profile/ProfileCard.vue'))
const PersonalInfoCard = defineAsyncComponent(() => import('../../components/profile/PersonalInfoCard.vue'))
const user_id = router.currentRoute.value.params.id as string;
const tabs = computed(() => [
    { id: 'details', label: t('tab.details'), icon: InfoIcon },
    { id: 'calendar', label: t('tab.calendar'), icon: CalendarIcon },
    { id: 'payroll', label: t('payroll'), icon: CreditCard },
    { id: 'documents', label: t('documents'), icon: Bookmark },
    { id: 'history', label: t('tab.history'), icon: ClockIcon },
])
const activeTab = ref<string>('details')
const modalOpen = ref(false);
const selectedUser = ref<any>(null)
const payrollsData = ref<IPayroll[]>([])
const payrollLoading = ref(false)
const contractFormAction = ref<"CREATE" | "UPDATE"> ("CREATE");
const isAddPayrollModalOpen = ref(false);
const isCreatingPayroll = ref(false);
const contractInfo = ref<IContract>({
    base_salary: 0,
    contract_end_date: "",
    is_cdi: false,
    contract_file_path: "",
    employee_id: 0,
    contract_start_date: "",
    probation_end_date: "",
    probation_start_date: "",
    special_conditions: "",
    status: 'Active',

})

const payrollForm = ref<IPayrollFormData>({
  payrollId: 0,
  payrollId_error: '',

  contractId: 0,
  contractId_error: '',

  monthYear: new Date().toISOString().split('T')[0],
  monthYear_error: '',

  grossSalary: contractInfo.value.base_salary,
  grossSalary_error: '',

  normalHours: 0,
  normalHours_error: '',

  overtimeHours: 0,
  overtimeHours_error: '',

  overtimePay: 0,
  overtimePay_error: '',

  bonuses: 0,
  bonuses_error: '',

  allowances: 0,
  allowances_error: '',

  cnpsContributions: 0,
  cnpsContributions_error: '',

  withheldTaxes: 0,
  withheldTaxes_error: '',

  netSalary: 0,
  netSalary_error: '',

  ribEmploye: '',
  ribEmploye_error: '',

  payslipFilePath: '',
  payslip_file_path_error: '',

  status: 'Pending',
  status_error: '',
})

watch(
  () => [
    payrollForm.value.grossSalary,
    payrollForm.value.overtimePay,
    payrollForm.value.bonuses,
    payrollForm.value.allowances,
    payrollForm.value.cnpsContributions,
    payrollForm.value.withheldTaxes,
  ],
  () => {
    const parse = (val: string | number) => Number(val) || 0

    const gross = parse(payrollForm.value.grossSalary)
    const overtime = parse(payrollForm.value.overtimePay)
    const bonuses = parse(payrollForm.value.bonuses)
    const allowances = parse(payrollForm.value.allowances)
    const cnps = parse(payrollForm.value.cnpsContributions)
    const taxes = parse(payrollForm.value.withheldTaxes)

    const net = gross + overtime + bonuses + allowances - cnps - taxes

    payrollForm.value.netSalary = Number(net.toFixed(2))
  },
  { immediate: true }
)

const payrollsForTable = computed(() => {
  return payrollsData.value.map((p: IPayroll) => ({
    ...p,
    statusColor: getPayrollStatusColor(p.status)
  }));
});

const isCreateContractModalOpen = ref(false);
const isTerminating = ref(false);

const { t } = useI18n()
const user = ref<any>({})
const contractInfoFormData = ref<IContractFormData>({
    base_salary: 0,
    contract_end_date: "",
    is_cdi: false,
    contract_file_path: null,
    contract_start_date: "",
    probation_end_date: "",
    probation_start_date: "",
    special_conditions: "",
    status: 'Active',

})

const showTerminationModal = ref(false);
const editUser = () => {
    selectedUser.value = user.value
    modalOpen.value = true
}
const toast = useToast()
const isLoading = ref(false)
const closeModal = () => {
    modalOpen.value = false
}
const fullName = computed(() =>
    `${user.value?.firstName ?? ''} ${user.value?.lastName ?? ''}`.trim()
)
const email = computed(() => user.value.email ?? '')

const openAddPayrollModal = () => {
    payrollForm.value = {
        payrollId: 0,
        payrollId_error: '',

        contractId: 0,
        contractId_error: '',

        monthYear: new Date().toISOString().split('T')[0],
        monthYear_error: '',

        grossSalary: contractInfo.value.base_salary,
        grossSalary_error: '',

        normalHours: 0,
        normalHours_error: '',

        overtimeHours: 0,
        overtimeHours_error: '',

        overtimePay: 0,
        overtimePay_error: '',

        bonuses: 0,
        bonuses_error: '',

        allowances: 0,
        allowances_error: '',

        cnpsContributions: 0,
        cnpsContributions_error: '',

        withheldTaxes: 0,
        withheldTaxes_error: '',

        netSalary: 0,
        netSalary_error: '',

        ribEmploye: '',
        ribEmploye_error: '',

        payslipFilePath: '',
        payslipFilePath_error: '',

        status: 'Pending',
        status_error: '',
    };
    isAddPayrollModalOpen.value = true;
};

const closeAddPayrollModal = () => {
    isAddPayrollModalOpen.value = false;
};

const handleCreatePayroll = async () => {
  if (!user.value.recentContract?.contractId) {
    toast.error("No active contract found for this employee.");
    return;
  }

  isLoading.value = true;

  try {

    const payload: IPayroll = {
        contract_id: user.value.recentContract.contractId,
        month_year: payrollForm.value.monthYear,
        gross_salary: payrollForm.value.grossSalary,
        normal_hours: payrollForm.value.normalHours,
        overtime_hours: payrollForm.value.overtimeHours,
        overtime_pay: payrollForm.value.overtimePay,
        bonuses: payrollForm.value.bonuses,
        allowances: payrollForm.value.allowances,
        cnps_contributions: payrollForm.value.cnpsContributions,
        withheld_taxes: payrollForm.value.withheldTaxes,
        net_salary: payrollForm.value.netSalary,
        rib_employe: payrollForm.value.ribEmploye,
        payslip_file_path: payrollForm.value.payslipFilePath,
    };

    console.log('--> payload', payload);
    await createPayroll(payload);
    toast.success(t('payroll.creation_success'));
    closeAddPayrollModal();
    await fetchPayrolls(String(user.value.recentContract.contractId));
  } catch (error) {
    console.error("Failed to create payroll:", error);
    toast.error(t('payroll.creation_error'));
  } finally {
    isLoading.value = false;
  }
};


const fetchPayrolls = async (contractId: string) => {
    payrollLoading.value = true;
    try {
        const response = await getPayrollsByContractId(contractId);
        console.log('-->response.data', response.data);
        payrollsData.value = response.data;
    } catch (error) {
        console.error("Failed to fetch payrolls:", error);
        toast.error(t('payroll.fetch_error'));
    } finally {
        payrollLoading.value = false;
    }
}

const downloadPayslip = (payroll: IPayroll) => {
    if (payroll.payslip_file_path) {
        window.open(payroll.payslip_file_path, '_blank');
    } else {
        toast.error(t('payslip_not_available'));
    }
}

const payrollTitles = computed(() => [
  { name: 'monthYear', label: t('monthYear'), type: 'text', sortable: true },
  { name: 'grossSalary', label: t('grossSalary'), type: 'currency', sortable: true },
  { name: 'overtimeHours', label: t('overtimeHours'), type: 'number' },
  { name: 'bonuses', label: t('bonuses'), type: 'currency' },
  { name: 'cnpsContributions', label: t('cnpsContributions'), type: 'currency' },
  { name: 'netSalary', label: t('netSalary'), type: 'currency', sortable: true },
  {
    name: 'actions',
    label: t('actions'),
    type: 'action',
    actions: [
      {
        name: 'Download Payslip',
        event: 'downloadPayslip',
        icone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
        stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download">
        <path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <path d="m7 10 5 5 5-5"/></svg>`,
      },
    ],
  },
]);


const getUserLocal = async () => {
    isLoading.value = true
    const response = await getEmployeesDetails(parseInt(user_id));
    console.log('-->response', response);
    user.value = response.data;
    if(response.data.recentContract){
        console.log('-->response.data.recentContract', response.data.recentContract);
        payrollForm.value.netSalary = response.data.recentContract.baseSalary;
        contractInfo.value = {
            base_salary: response.data.recentContract.baseSalary,
            contract_end_date: response.data.recentContract.contractEndDate,
            is_cdi: response.data.recentContract.isCdi,
            contract_file_path: response.data.recentContract.contractFilePath,
            employee_id: response.data.recentContract.employeeId,
            contract_start_date: response.data.recentContract.contractStartDate,
            probation_end_date: response.data.recentContract.probationEndDate,
            probation_start_date: response.data.recentContract.probationStartDate,
            special_conditions: response.data.recentContract.specialConditions,
            status: response.data.recentContract.status,
            contract_id: response.data.recentContract.contractId,
        }
        await fetchPayrolls(String(response.data.recentContract.contractId));
    }

    isLoading.value = false;
}

function handleFileUpload(event: any) {
  const file = event.target.files[0]
  contractInfoFormData.value.contract_file_path = file
}

const handleConfirmTermination = async () => {
    try {
        if(contractInfo.value.contract_id){
            isLoading.value = true;
            const result = await terminateContract(contractInfo.value.contract_id)
            refresh()
            showTerminationModal.value = false;
            toast.info(t('contract.terminateSuccessfullyMessage'));
        }
        
    } catch (error) {
        console.log('StaffDetail.handleAssignContract.error', error);
        toast.error(t('contract.terminateFailedessage'))
    } finally {
        isLoading.value = false;
    }
}

const contractCreationCheckDataValidity = (contractInfoFormData: IContractFormData): boolean => {
  // Reset des erreurs
  contractInfoFormData.probation_start_date_error = ''
  contractInfoFormData.probation_end_date_error = ''
  contractInfoFormData.contract_start_date_error = ''
  contractInfoFormData.contract_end_date_error = ''

  let hasError = false

  const probationStart = new Date(contractInfoFormData.probation_start_date)
  const probationEnd = new Date(contractInfoFormData.probation_end_date)
  const contractStart = new Date(contractInfoFormData.contract_start_date)
  const contractEnd = contractInfoFormData.contract_end_date
    ? new Date(contractInfoFormData.contract_end_date)
    : null

  // Si CDD, la date de fin est requise et doit être après la date de début
  if (!contractInfoFormData.is_cdi) {
    if (!contractInfoFormData.contract_end_date) {
      contractInfoFormData.contract_end_date_error = t('contract_end_date_required_for_cdd')
      hasError = true
    } else if (contractEnd && contractEnd <= contractStart) {
      contractInfoFormData.contract_end_date_error = t('contract_end_date_must_be_after_start')
      hasError = true
    }
  }

  // Fin de période d’essai après le début de celle-ci
  if (probationEnd <= probationStart) {
    contractInfoFormData.probation_end_date_error = t('probation_end_date_must_be_after_start')
    hasError = true
  }

  // La période d'essai doit se terminer avant le début du contrat
  if (probationEnd > contractStart) {
    contractInfoFormData.probation_end_date_error = t('probation_end_before_contract_start')
    hasError = true
  }

  return !hasError
}



const contractUpdateCheckDataValidity = (
  contractInfoFormData: IContractFormData,
  contractInfo: IContract
): boolean => {
  // Réinitialisation des erreurs
  contractInfoFormData.probation_start_date_error = ''
  contractInfoFormData.probation_end_date_error = ''
  contractInfoFormData.contract_start_date_error = ''
  contractInfoFormData.contract_end_date_error = ''

  let hasError = false

  const parseDate = (value: string) => {
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
  }

  const originalContractStart = parseDate(contractInfo.contract_start_date)
  const probationStart = parseDate(contractInfoFormData.probation_start_date)
  const probationEnd = parseDate(contractInfoFormData.probation_end_date)
  const contractStart = parseDate(contractInfoFormData.contract_start_date)
  const contractEnd = contractInfoFormData.contract_end_date
    ? parseDate(contractInfoFormData.contract_end_date)
    : null

  // Vérif: contract_start_date >= ancien start_date
  if (contractStart && originalContractStart && contractStart < originalContractStart) {
    contractInfoFormData.contract_start_date_error = t('contractUpdate.invalid_start_date')
    hasError = true
  }

  // Vérif: contract_end_date requis si !is_cdi
  if (!contractInfoFormData.is_cdi) {
    if (!contractEnd) {
      contractInfoFormData.contract_end_date_error = t('contractUpdate.missing_end_date')
      hasError = true
    } else if (contractStart && contractEnd <= contractStart) {
      contractInfoFormData.contract_end_date_error = t('contractUpdate.end_date_before_start')
      hasError = true
    }
  }

  // Vérif: probation_end > probation_start
  if (probationStart && probationEnd && probationEnd <= probationStart) {
    contractInfoFormData.probation_end_date_error = t('contractUpdate.probation_end_before_start')
    hasError = true
  }

  // ✅ Vérif: probation_start < contract_start
  if (probationStart && contractStart && probationStart >= contractStart) {
    contractInfoFormData.probation_start_date_error = t('contractUpdate.probation_start_after_contract')
    hasError = true
  }

  // Vérif: probation_end <= contract_end si non CDI
  if (!contractInfoFormData.is_cdi && probationEnd && contractEnd && probationEnd > contractEnd) {
    contractInfoFormData.probation_end_date_error = t('contractUpdate.probation_out_of_range')
    hasError = true
  }

  return !hasError
}




const handleAssignContract = async () => {
  
    const payload: IContract = {
        employee_id: Number.parseInt(user_id),
        base_salary: contractInfoFormData.value.base_salary,
        contract_end_date: contractInfoFormData.value.is_cdi ? "" : contractInfoFormData.value.contract_end_date,
        contract_start_date: contractInfoFormData.value.contract_start_date,
        probation_end_date: contractInfoFormData.value.probation_end_date,
        probation_start_date: contractInfoFormData.value.probation_start_date,
        special_conditions: "",
        contract_file_path: "x/y/z",
        is_cdi: contractInfoFormData.value.is_cdi,
        status: 'Active',
    }
    console.log('-->payload', payload);

    try {
        if(contractFormAction.value == "CREATE") {
            //!contractCreationCheckDataValidity(contractInfoFormData.value)
            if (!contractCreationCheckDataValidity(contractInfoFormData.value)) {
                console.log("CREATE : validation error", contractCreationCheckDataValidity(contractInfoFormData.value));
            } else {
                let imageUrl = " "
                isLoading.value = true 
                if(contractInfoFormData.value.contract_file_path){
                    imageUrl = await uploadToCloudinary(contractInfoFormData.value.contract_file_path);
                    payload.contract_file_path = imageUrl;
                }
                
                const result = await createContract(payload);
                console.log('-->result', result)
                isLoading.value = false;
                isCreateContractModalOpen.value = false;
                refresh()
                toast.success(t('contract_creation_success'));
            }
            
        } else {
            //!contractUpdateCheckDataValidity(contractInfoFormData.value, contractInfo.value)
            if (!contractUpdateCheckDataValidity(contractInfoFormData.value, contractInfo.value)) {
                console.log("UPDATE : validation error", contractUpdateCheckDataValidity(contractInfoFormData.value, contractInfo.value))
                
            } else {
                isLoading.value = true
                let imageUrl = " ";
                
                if(contractInfoFormData.value.contract_file_path){
                    imageUrl = await uploadToCloudinary(contractInfoFormData.value.contract_file_path);
                    payload.contract_file_path = imageUrl;
                }

                const result = await updateContract({...payload, contract_id: contractInfo.value.contract_id});
                console.log('-->result', result)
                isLoading.value = false;
                isCreateContractModalOpen.value = false;
                refresh()
                toast.success(t('contract_update_success'));
            }
        }
    } catch (error) {
        console.log('StaffDetail.handleAssignContract.error', error);
        toast.error(t('contract_creation_failed'))
    }

}
const editContract=()=>{
    contractFormAction.value = 'UPDATE';
    contractInfoFormData.value = {
        base_salary: contractInfo.value.base_salary,
        contract_end_date: contractInfo.value.contract_end_date,
        is_cdi: contractInfo.value.is_cdi,
        contract_file_path: null,
        contract_start_date: contractInfo.value.contract_start_date,
        probation_end_date: contractInfo.value.probation_end_date,
        probation_start_date: contractInfo.value.probation_start_date,
        special_conditions: contractInfo.value.special_conditions,
        status: contractInfo.value.status,
    }
    isCreateContractModalOpen.value = true
}



// On mount: fetch and update store + profile
onMounted(async () => {
    getUserLocal()
})

const refresh = () => {
    modalOpen.value = false;
    getUserLocal();
}

const getRoleBadge = (roleName: string) => {
    const roleMap: Record<string, { bg: string; text: string; label: string }> = {
        admin: {
            label: 'Administrator',
            bg: 'bg-red-100',
            text: 'text-red-800',
        },
        editor: {
            label: 'Editor',
            bg: 'bg-blue-100',
            text: 'text-blue-800',
        },
        viewer: {
            label: 'Viewer',
            bg: 'bg-green-100',
            text: 'text-green-800',
        },
        unknown: {
            label: 'Unknown',
            bg: 'bg-gray-100',
            text: 'text-gray-800',
        },
    }

    return (
        roleMap[roleName] || {
            label: roleName,
            bg: 'bg-purple-100',
            text: 'text-purple-800',
        }
    )
}
const getStatusColor = (_status: string) => {
    const status = _status.toLocaleLowerCase();
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700'
        default:
            return 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-500'
    }
}

const getPayrollStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'paid':
      return { label: t('paid'), bg: 'bg-green-100', text: 'text-green-700' };
    case 'pending':
      return { label: t('pending'), bg: 'bg-yellow-100', text: 'text-yellow-700' };
    case 'failed':
      return { label: t('failed'), bg: 'bg-red-100', text: 'text-red-700' };
    default:
      return { label: t(status || 'unknown'), bg: 'bg-gray-100', text: 'text-gray-700' };
  }
}

</script>
