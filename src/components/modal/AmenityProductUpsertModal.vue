<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'
import {
    createAmenityProduct,
    updateAmenityProduct,
} from '@/services/api'
import { useI18n } from 'vue-i18n'
import { defaultAmenityProductPayloadPayload, type AmenityProductPayload } from '@/utils/models'
import { useServiceStore } from '@/composables/serviceStore'
import InputCurrency from '../forms/FormElements/InputCurrency.vue'

const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))
const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'))
const isLoading = ref(false)
const serviceStore = useServiceStore()
const toast = useToast()
const { t } = useI18n()
const emits = defineEmits(['refresh', 'close']);
const props = defineProps({
    isEditMode: {
        type: Boolean,
        default: false,
    },
    selectedAmentyProduct: {
        type: Object,
        default: null,
    },
    modalOpen: {
        type: Boolean,
        default: false
    },
    categoriesId: {
        type: Number,
    }
})

const form = ref<AmenityProductPayload>(defaultAmenityProductPayloadPayload())
const saveAmenitieService = async () => {
    isLoading.value = true
    try {
        const serviceId = serviceStore.serviceId;
        form.value.service_id = serviceId!
        form.value.amenities_category_id = props.categoriesId!

        const response = await createAmenityProduct(form.value)
        console.log('response', response)
        if (response.status === 201 || response.status === 200) {
            emits('refresh')
            form.value = defaultAmenityProductPayloadPayload()
            toast.success(t('toast.SuccessCreated'))
        } else {
            toast.error(t('toast.ErrorCreated'))
        }
    } catch (error: any) {
        toast.error(t('toast.ErrorCreated'))
        console.error('❌ Error while saving:', error.response?.data || error.message)
    } finally {
        isLoading.value = false
    }
}

const status = ref([{ label: t('active'), value: 'active' }, { label: t('inactive'), value: 'inactive' }])
const timeUnits = ref([
    { label: t('hour'), value: 'hour' },
    { label: t('day'), value: 'day' },
])

const pricingModels = ref([
    { label: t('flat_rate'), value: 'flat_rate' },
    { label: t('time_based'), value: 'time_based' },
])

const updateFormData = async () => {
    isLoading.value = true

    try {
        const serviceId = serviceStore.serviceId
        const id = props.selectedAmentyProduct?.id

        if (!id) {
            return
        }

        form.value.service_id = serviceId!
        form.value.amenities_category_id = props.categoriesId!
        console.log('Payload envoyé :', form.value)
        await updateAmenityProduct(id, form.value)
        form.value = defaultAmenityProductPayloadPayload()
        toast.success(t('toast.UpdatedSuccess'))
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
            await saveAmenitieService()
        }
    } finally {
        isLoading.value = false
    }
}

const closeModal = () => {
    console.log('closeModal')
    form.value = defaultAmenityProductPayloadPayload()
    emits('close')
}



onMounted(() => {
    console.log('props.selectedUser', props.selectedAmentyProduct);
    if (props.selectedAmentyProduct) {
        form.value.name = props.selectedAmentyProduct.name
        form.value.description = props.selectedAmentyProduct.description
        form.value.status = props.selectedAmentyProduct.status
        form.value.price = props.selectedAmentyProduct.price
        form.value.service_id = props.selectedAmentyProduct.service_id
        form.value.amenities_category_id = props.selectedAmentyProduct.amenities_category_id;
        form.value.amenities_category_id = props.categoriesId!
        form.value.pricing_model = props.selectedAmentyProduct.pricing_model;
        form.value.time_unit = props.selectedAmentyProduct.time_unit;
    }
})
</script>

<template>
    <div>
        <Modal v-if="modalOpen" @close="closeModal()">
            <template #body>
                <div
                    class="no-scrollbar  relative  max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
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
                            {{ isEditMode ? $t('editProduct') : $t('NewProduct') }}
                        </h4>
                    </div>
                    <form @submit.prevent="handleSubmit" class="flex flex-col">
                        <div class="max-h-max  p-2">
                            <div class="space-y-8">
                                <div>
                                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                                        <Input :lb="$t('Name')" :id="'name'" :forLabel="'name'" v-model="form.name"
                                            :is-required="true" :placeholder="$t('Name')" />
                                        <Select :is-required="true" :lb="$t('Status')" v-model="form.status"
                                            :options="status" />
                                        <Select :is-required="true" :lb="$t('pricing_model')"
                                            v-model="form.pricing_model" :options="pricingModels" />
                                        <Select v-if="form.pricing_model === 'time_based'" :is-required="true" :lb="$t('time_unit')" v-model="form.time_unit"
                                            :options="timeUnits" />
                                        <InputCurrency v-model="form.price" :lb="$t('price')" />


                                        <div class="mb-4 col-span-2">
                                            <label
                                                class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{
                                                    $t('Description')
                                                }}</label>
                                            <textarea v-model="form.description"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-900 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                                                rows="3"></textarea>
                                        </div>
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
                                <span v-if="!isLoading"> {{ isEditMode ? $t('editProduct') : $t('Save') }}</span>
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
