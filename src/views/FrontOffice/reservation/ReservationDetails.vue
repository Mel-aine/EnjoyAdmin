<script setup lang="ts">
import { ArrowLeft, Building2Icon, PencilIcon, Pin, PlusCircle, User2Icon, CheckCircle, CreditCard, Calendar, ArrowUpDown, StopCircle, List, X, Eye, Trash2, UserMinus } from 'lucide-vue-next';
import ChevromLeftIcon from '../../../icons/ChevromLeftIcon.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FoglioOperation from '../../../components/reservations/foglio/FoglioOperation.vue';
import ButtonDropdown from '../../../components/common/ButtonDropdown.vue';

// Simple Button component
const Button = {
    template: '<button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"><slot /></button>'
};
const { t } = useI18n();

const tabs = computed(() => [
    { id: 'folio_operations', label: t('Folio Operations') },
    { id: 'booking_details', label: t('Booking Details') },
    { id: 'guestç_details', label: t('Guest Details') },
    { id: 'Room charges', label: t('Room Charges') },
    { id: 'credid_card', label: t('Credit Card') },
    { id: 'audit_trial', label: t('Audit Trail') },

]);
const activeTab = ref<string>('folio_operations');
const isOpen = ref(false);

const dropdownOptions = computed(() => [
    { id: 'check-in', label: t('Check-in'), icon: CheckCircle, color: 'text-blue-600' },
    { id: 'add-payment', label: t('Add Payment'), icon: CreditCard, color: 'text-green-600' },
    { id: 'amend-stay', label: t('Amend Stay'), icon: Calendar, color: 'text-purple-600' },
    { id: 'room-move', label: t('Room Move'), icon: ArrowUpDown, color: 'text-orange-600' },
    { id: 'exchange-room', label: t('Exchange Room'), icon: ArrowUpDown, color: 'text-indigo-600' },
    { id: 'stop-room-move', label: t('Stop Room Move'), icon: StopCircle, color: 'text-red-600' },
    { id: 'inclusion-list', label: t('Inclusion List'), icon: List, color: 'text-gray-600' },
    { id: 'cancel-reservation', label: t('Cancel Reservation'), icon: X, color: 'text-red-600' },
    { id: 'no-show', label: t('No Show'), icon: Eye, color: 'text-yellow-600' },
    { id: 'void-reservation', label: t('Void Reservation'), icon: Trash2, color: 'text-red-700' },
    { id: 'unassign-room', label: t('Unassign Room'), icon: UserMinus, color: 'text-gray-600' },
]);

const handleOptionSelected = (option: any) => {
    console.log('Selected option:', option);
    // Add your logic here for each option
};
</script>

<template>
    <div class="h-full">
        <!--Header-->
        <div class="shadow-sm px-4 py-2 mx-4 bg-white mt-5 flex justify-between">
            <div class="flex gap-2 align-middle self-center items-center">
                <ArrowLeft></ArrowLeft>
                <Building2Icon></Building2Icon>
                <span class="font-bold">Mr.Tchio</span>
                <div class="flex">
                    <User2Icon class="w-4" />
                    <span class="text-sm items-end align-center self-center">1</span>
                </div>
                <div class="flex">
                    <User2Icon class="w-4" />
                    <span class="text-sm items-end align-bottom self-center">1</span>
                </div>
            </div>
            <div class="flex gap-8">
                <!--arrival Days-->
                <div class="flex flex-col">
                    <span class="text-sm font-bold">{{ $t('Arrival') }}</span>
                    <span class="text-xs flex gap-2">
                        <span>10/11/2025-19:58</span>
                        <span @click="alert('change')">
                            <PencilIcon class="w-3" />
                        </span>
                    </span>
                </div>
                <!--depature-->
                <div class="flex flex-col">
                    <span class="text-sm font-bold">{{ $t('Depature') }}</span>
                    <span class="text-xs flex gap-2">
                        <span>10/11/2025-19:58</span>
                        <span @click="alert('change')">
                            <PencilIcon class="w-3" />
                        </span>
                    </span>
                </div>
                <!--Nigth-->
                <div class="flex flex-col">
                    <span class="text-sm font-bold">{{ $t('night') }}</span>
                    <span class="text-xs flex gap-2">
                        <span>4</span>
                    </span>
                </div>
                <!--room/roomtype-->
                <div class="flex flex-col">
                    <span class="text-sm font-bold">{{ $t('Room/Room types') }}</span>
                    <span class="text-xs flex gap-2">
                        <span>14/Single</span>
                    </span>
                </div>
                <!--depature-->
                <div class="flex flex-col">
                    <span class="text-sm font-bold">{{ $t('res.no') }}</span>
                    <span class="text-xs flex gap-2">
                        <span>16</span>
                    </span>
                </div>
            </div>
            <div class="flex gap-x-2">
                <span
                    class="border align-middle p-1 text-sm items-center self-center border-amber-600 text-amber-500">Reserved</span>
                <button class="bg-primary px-4 py-1 align-middle p-1 text-sm items-center self-center">{{ $t('check in')
                }}</button>
            </div>
        </div>
        <!--main-->
        <div class="shadow-sm px-2 pt-1 mx-4 bg-white mt-5 flex justify-between">
            <!-- Tabs Navigation -->
            <div class="flex justify-between w-full">
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                            'py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200',
                            activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        ]">
                            <div class="flex items-center space-x-2">
                                <span>{{ tab.label }}</span>
                            </div>
                        </button>
                    </nav>
                </div>
                <div class="align-middle self-center items-center">
                    <ButtonDropdown 
                        :options="dropdownOptions"
                        :button-text="$t('More Options')"
                        button-class="bg-blue-600 text-white hover:bg-blue-700"
                        dropdown-class="w-64"
                        @option-selected="handleOptionSelected"
                    />
                </div>
            </div>
        </div>
        <div class="flex h-[calc(100vh-160px)]  mx-4">
            <div class="w-2/12 border-r-2 border-s-1 border-gray-100 bg-gray-50">
                <div class="h-full flex flex-col justify-between">
                    <div class="bg-white h-full">
                        <div class="flex justify-between pt-2 px-2">
                            <span>Room/foglo</span>
                            <button>
                                <PlusCircle />
                            </button>
                        </div>
                        <div class="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-50"
                            @click="isOpen = !isOpen">
                            <span>Room Details</span>
                            <ChevromLeftIcon class="w-4 h-4 transition-transform duration-200" :class="[
                                isOpen ? 'rotate-90 text-green-500' : '-rotate-90 text-red-500'
                            ]" />
                        </div>
                        <div v-if="isOpen">
                            isOpen
                        </div>
                    </div>
                    <div class="px-4">
                        <div class="flex justify-between">
                            <span>{{ $t('total') }}</span>
                            <span>2000xaf</span>
                        </div>
                        <div class="flex justify-between  text-yellow-200">
                            <span>{{ $t('balence') }}</span>
                            <span>2000xaf</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-10/12">
                <!-- Tab Content -->
                <div v-if="activeTab === 'folio_operations'">
                    <FoglioOperation />
                </div>
                <div v-else-if="activeTab === 'booking_details'">
                    <div class="text-center py-8 text-gray-500">
                        <h3 class="text-lg font-medium">{{ $t('Booking Details') }}</h3>
                        <p class="mt-2">{{ $t('Booking details content will be displayed here') }}</p>
                    </div>
                </div>
                <div v-else-if="activeTab === 'guestç_details'">
                    <div class="text-center py-8 text-gray-500">
                        <h3 class="text-lg font-medium">{{ $t('Guest Details') }}</h3>
                        <p class="mt-2">{{ $t('Guest details content will be displayed here') }}</p>
                    </div>
                </div>
                <div v-else-if="activeTab === 'Room charges'">
                    <div class="text-center py-8 text-gray-500">
                        <h3 class="text-lg font-medium">{{ $t('Room Charges') }}</h3>
                        <p class="mt-2">{{ $t('Room charges content will be displayed here') }}</p>
                    </div>
                </div>
                <div v-else-if="activeTab === 'credid_card'">
                    <div class="text-center py-8 text-gray-500">
                        <h3 class="text-lg font-medium">{{ $t('Credit Card') }}</h3>
                        <p class="mt-2">{{ $t('Credit card content will be displayed here') }}</p>
                    </div>
                </div>
                <div v-else-if="activeTab === 'audit_trial'">
                    <div class="text-center py-8 text-gray-500">
                        <h3 class="text-lg font-medium">{{ $t('Audit Trail') }}</h3>
                        <p class="mt-2">{{ $t('Audit trail content will be displayed here') }}</p>
                    </div>
                </div>
                <div v-else>
                    <div class="text-center py-8 text-gray-500">
                        <h3 class="text-lg font-medium">{{ $t('Welcome') }}</h3>
                        <p class="mt-2">{{ $t('Select a tab to view content') }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>