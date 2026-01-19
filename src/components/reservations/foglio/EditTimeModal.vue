<template>
    <!-- Edit Time Modal -->
    <div v-if="isOpen"
        class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-gray-900/25">
        <div
            class="relative top-20 mx-auto p-5 border w-[450px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-800">
            <div class="mt-3">
                <!-- Modal Header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {{ modalTitle }}
                    </h3>
                    <button @click="closeModal"
                        class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Loading Skeleton -->
                <div v-if="isLoading" class="space-y-4">
                    <div class="animate-pulse">
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div class="flex justify-end space-x-3">
                            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                    </div>
                </div>

                <!-- Modal Form -->
                <form @submit.prevent="handleSubmit" v-else>
                    <!-- Time Input -->
                    <div class="mb-6">
                      <InputTimePicker v-model="formData.time" :title="timeLabel" custom-class="rounded-lg" />

                        <!-- <Input
                            :lb="timeLabel"
                            v-model="formData.time"
                            type="time"
                            required

                            :class="{ 'error': errors.time }"
                        />
                        <p v-if="errors.time" class="mt-1 text-sm text-red-600 dark:text-red-400">
                            {{ errors.time }}
                        </p> -->
                    </div>

                    <!-- Current Information Display -->
                    <div class="mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            <span class="font-medium">{{ $t('Current') }}:</span>
                            {{ currentTime || $t('Not set') }}
                        </p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-3">
                        <BasicButton
                            type="button"
                            variant="outline"
                            @click="closeModal"
                            :label="$t('cancel')"
                            :disabled="loading"
                        />
                        <BasicButton
                            type="submit"
                            variant="primary"
                            :label="$t('save')"
                            :loading="loading"
                        />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { X } from 'lucide-vue-next'
import BasicButton from '../../buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import InputTimePicker from '@/components/forms/FormElements/InputTimePicker.vue'
 import { updateBookingDetail } from '../../../services/reservation'

interface Props {
    isOpen: boolean
    reservationId?: string | number
    timeType: 'arrival' | 'departure'
    currentTime?: string
    reservation?: any
}

interface Emits {
    (e: 'close'): void
    (e: 'time-updated', data: TimeUpdateData): void
}

interface TimeUpdateData {
    timeType: 'arrival' | 'departure'
    time: string
    reservationId?: string | number
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: false,
    timeType: 'arrival'
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
const isLoading = ref(false)
const errors = ref<{ time?: string }>({})

const formData = ref({
    time: ''
})

// Computed properties
const modalTitle = computed(() => {
    return props.timeType === 'arrival'
        ? t('Edit Check-in Time')
        : t('Edit Check-out Time')
})

const timeLabel = computed(() => {
    return props.timeType === 'arrival'
        ? t('Check-in Time')
        : t('Check-out Time')
})

// Methods
const closeModal = () => {
    resetForm()
    emit('close')
}

const resetForm = () => {
    formData.value.time = ''
    errors.value = {}
}


const handleSubmit = async () => {

    try {
        loading.value = true

        const updateData: TimeUpdateData = {
            timeType: props.timeType,
            time: formData.value.time,
        }

        const response = await updateBookingDetail(props.reservationId,updateData)
        console.log('Update Response:', response)

        // Emit the time update event
        emit('time-updated', updateData)

        // Show success message
        const successMessage = props.timeType === 'arrival'
            ? t('Check-in time updated successfully')
            : t('Check-out time updated successfully')
        toast.success(successMessage)

        // Close modal
        closeModal()
    } catch (error: any) {
        console.error('Error updating time:', error)
        const errorMessage = error.response?.data?.message
            || error.message
            || t('Error updating time')
        toast.error(errorMessage)
    } finally {
        loading.value = false
    }
}

const initializeForm = () => {
    if (props.currentTime) {
        formData.value.time = props.currentTime
    } else if (props.reservation) {
        const time = props.timeType === 'arrival'
            ? props.reservation.checkInTime
            : props.reservation.checkOutTime

        if (time) {
            // Convert time format if needed (e.g., "14:30:00" to "14:30")
            formData.value.time = time.substring(0, 5)
        }
    }
}

// Watchers
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        initializeForm()
    } else {
        resetForm()
    }
})

watch(() => props.currentTime, (newVal) => {
    if (newVal && props.isOpen) {
        formData.value.time = newVal
    }
})

// Lifecycle
onMounted(() => {
    if (props.isOpen) {
        initializeForm()
    }
})
</script>

<style scoped>
/* Custom styles for the modal */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Focus styles for better accessibility */
input:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Error state styles */
.error {
    border-color: #ef4444;
}

.error:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
    input[type="time"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
    }
}
</style>
