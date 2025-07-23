<template>
    <div class="space-y-6">
        <!-- Room selection section -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            v-if="localRoomSelection">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Room Type -->
                <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        {{ $t('SelectRoomType') }} {{ `#${index + 1}` }}
                    </label>
                    <select v-model="localRoomSelection.roomTypeSelect" class="h-11 w-full rounded-lg border text-sm">
                        <option value="" disabled>{{ $t('PleaseSelectRoomType') }}</option>
                        <option v-for="type in ActiveRoomTypes" :key="type.id" :value="type.id">
                            {{ type.label }}
                        </option>
                    </select>
                </div>

                <!-- Room Available -->
                <div>
                    <label class="mb-1.5 flex gap-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                        <span>{{ $t('SelectRoom') }} {{ `#${index + 1}` }}</span>
                        <DotSpinner v-if="isLoadingRoom" />
                    </label>

                    <div>
                        <select v-model="localRoomSelection.roomType"
                            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                            <option value="" disabled>
                                {{
                                    availableRoomsByType
                                        ? $t('PleaseSelectRoom')
                                        : $t('NoRoomsAvailableForThisType')
                                }}
                            </option>
                            <option v-for="room in availableRoomsByType" :key="room.id" :value="room.id">
                                {{ room.label }} {{ room.roomNumber }}
                            </option>
                        </select>
                    </div>


                </div>


                <!-- Room Price -->
                <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        {{ $t('RoomPrice') }}
                    </label>
                    <OutputFieldCurrency type="text" :disabled="true" :value="roomSelection.roomPrice ??
                        availableRooms.find((r) => r.id === roomSelection.roomType)?.price ??
                        ''
                        " readonly />
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-3">
                <div>
                    <Input :lb="$t('DefaultGuest')" :inputType="'Number'" :placeholder="$t('DefaultGuest')"
                        :id="'defaultGuest'" :forLabel="'defaultGuest'" :disabled="true"
                        v-model="localRoomSelection.default_guest" :min="1" :required="true" />
                </div>

                <div>
                    <Input :lb="$t('ExtraGuest')" :inputType="'Number'" :placeholder="$t('ExtraGuest')"
                        :id="'extraGuest'" :forLabel="'extraGuest'" v-model="localRoomSelection.extra_guest" :min="0" />
                </div>
                <div>
                    <Input :lb="$t('Children')" :inputType="'Number'" :placeholder="$t('children')" :id="'children'"
                        :forLabel="'children'" v-model="localRoomSelection.children" :min="0" />
                </div>
                <div>
                    <Input :lb="$t('TotalGuests')" :inputType="'Number'" :placeholder="$t('TotalGuests')"
                        :id="'totalGuests'" :forLabel="'totalGuests'" :disabled="true"
                        v-model="localRoomSelection.total_guests" :min="1" :required="true" />
                </div>
            </div>
            <!-- Price Summary -->
            <div class="bg-gray-50 mt-3 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-700 dark:text-gray-300">{{ $t('DefaultDeposit') }}</span>
                        <span class="text-gray-900 dark:text-white">{{
                            formatCurrency(localRoomSelection.default_deposit ?? 0) }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-700 dark:text-gray-300">{{ $t('BasePrice') }}</span>
                        <span class="text-gray-900 dark:text-white">{{ formatCurrency(basePrice) }}</span>
                    </div>

                    <div v-if="(localRoomSelection.extra_guest ?? 0) > 0 || isEditMode"
                        class="flex justify-between items-center">
                        <span class="text-gray-700 dark:text-gray-300">
                            {{ $t('ExtraGuestFee') }} ({{ localRoomSelection.extra_guest }} {{ $t('guests') }})
                        </span>
                        <span class="text-gray-900 dark:text-white">{{ formatCurrency(extraGuestPrice ?? '')
                            }}</span>
                    </div>


                    <hr class="border-gray-300 dark:border-gray-600" />

                    <div class="flex justify-between items-center">
                        <span class="font-medium text-lg text-gray-900 dark:text-white">
                            {{ $t('TotalPrice') }}
                        </span>
                        <span class="font-bold text-xl text-gray-900 dark:text-white">
                            {{ formatCurrency(finalTotalPrice) }}
                        </span>
                    </div>

                    <div v-if="(localRoomSelection.default_deposit ?? 0) > 0" class="flex justify-between items-center">
                        <span class="text-gray-700 dark:text-gray-300">{{ $t('Deposit') }}</span>
                        <span class="text-green-600 dark:text-green-400 font-medium">
                            {{ formatCurrency((localRoomSelection.default_deposit ??
                                0) * localRoomSelection.numberOfNights) }}
                        </span>
                    </div>
                </div>
            </div>
            <!-- Remove Room -->
            <div v-if="removeAvailableRooms" class="mt-4 flex justify-end">
                <button @click.prevent="removeRoom(index)"
                    class="flex items-center text-red-500 hover:text-red-700 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-trash2-icon lucide-trash-2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                    {{ $t('RemoveRoom') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Input from '@/components/forms/FormElements/Input.vue'
import OutputFieldCurrency from '@/components/forms/FormElements/outputFieldCurrency.vue'
import { formatCurrency } from '@/components/utilities/UtilitiesFunction'
import { ref, computed, watch, defineProps, defineEmits, onMounted, onBeforeMount } from 'vue'
import { type Room, type RoomSelection } from '@/utils/models'
import type { RoomTypeData } from '@/types/option'
import { finAvailableHome } from '@/services/api'
import DotSpinner from '@/components/spinner/DotSpinner.vue'




const props = defineProps<{
    ActiveRoomTypes: RoomTypeData[]
    availableRooms: Room[]
    currency?: string
    initialRoomSelections?: RoomSelection[]
    selectedRoomType: RoomTypeData | null
    roomSelection: RoomSelection,
    isEditMode?: boolean,
    index: number,
    removeAvailableRooms: boolean,
    takenRoomIds: string[],
    serviceId: number,
    arrivalDate: string,
    departureDate: string

}>()
const roomsAvailableByTypes = ref<Room[]>([]);
const isLoadingRoom = ref(false);
const emit = defineEmits(['update:removeRoom', 'update:change', "roomChange"])
const localRoomSelection = ref<RoomSelection>(props.roomSelection)

function removeRoom(index: number) {
    emit('roomChange', localRoomSelection.value.roomType);
    emit('update:removeRoom', index)
}

const sendChange = () => {
    emit('update:change', localRoomSelection.value, props.index)
}

const extraGuestPrice = computed(() => {
    return (localRoomSelection.value.extra_guest * localRoomSelection.value.extraGuestPrice) * (localRoomSelection.value.numberOfNights)
});

const basePrice = computed((): number => {
    return localRoomSelection.value.roomPrice
        ? localRoomSelection.value.roomPrice * (localRoomSelection.value.numberOfNights)
        : 0
})
function extractDate(timestamp: string) {
    return timestamp.split('T')[0];
}
const availableRoomsByType = computed(() => {
    return roomsAvailableByTypes.value.concat(props.availableRooms).filter((room) => {
        const matchesType = (Number(room.roomTypeSelect) === Number(localRoomSelection.value.roomTypeSelect) && (!props.takenRoomIds.includes(room.id) || room.id === localRoomSelection.value.roomType))
        return matchesType
    })
});


watch(() => localRoomSelection.value.roomTypeSelect, (newType) => {
    const selectedType = props.ActiveRoomTypes.find(t => Number(t.id) === newType)
    console.log('enter here')
    if (selectedType) {
        localRoomSelection.value.default_guest = Number(selectedType.defaultGuest) || 1
        localRoomSelection.value.default_deposit = selectedType.defaultDeposit || 0
        localRoomSelection.value.total_guests = localRoomSelection.value.default_guest || 1
        localRoomSelection.value.extra_guest = 0
        localRoomSelection.value.extraGuestPrice = selectedType.extraGuestPrice || 0
        localRoomSelection.value.roomPrice = selectedType.price;
        sendChange()
        findRoomService();
    }
})
const initData = () => {
    console.log('localRoomSelection', localRoomSelection.value)
    const selectedType = props.ActiveRoomTypes.find(t => Number(t.id) === localRoomSelection.value.roomTypeSelect)
    if (selectedType) {
        localRoomSelection.value.default_guest = Number(selectedType.defaultGuest) || 1
        localRoomSelection.value.default_deposit = selectedType.defaultDeposit || 0
        localRoomSelection.value.total_guests = localRoomSelection.value.default_guest || 1
        localRoomSelection.value.extra_guest = 0
        localRoomSelection.value.extraGuestPrice = selectedType.extraGuestPrice || 0
        localRoomSelection.value.roomPrice = selectedType.price;
        sendChange();
        findRoomService();
        console.log('selectedType.localRoomSelection', localRoomSelection.value)
        console.log('selectedType.extraGuestPrice', selectedType.extraGuestPrice)
    }
}
watch(() => localRoomSelection.value.roomType, (newType, oldType) => {
    emit('roomChange', oldType);
    emit('roomChange', newType);
    sendChange()
})

watch(() => localRoomSelection.value.extra_guest, (newSelection) => {
    localRoomSelection.value.total_guests = (localRoomSelection.value.default_guest || 0) + (Number(newSelection) || 0);
    sendChange()
})

onMounted(() => {
    initData()
})
const finalTotalPrice = computed(() => {
    return Number(basePrice.value) + Number(extraGuestPrice.value)
})

onBeforeMount(() => {
    initData()
})

const findRoomService = async () => {
    isLoadingRoom.value = true;
    if (localRoomSelection.value.roomTypeSelect) {
        try {
            const rooms = await finAvailableHome(props.serviceId, localRoomSelection.value.roomTypeSelect, extractDate(props.arrivalDate), extractDate(props.departureDate));
           console.log('error', rooms);

            roomsAvailableByTypes.value = rooms.data.map((room: any) => {
                return {
                    id: room?.id,
                    productName: room.productName,
                    roomNumber : room.roomNumber,
                    price: room.roomPrice,
                    label: room.productName,
                    roomType: room?.id,
                    roomTypeSelect: room?.productTypeId,
                    numberOfNights: 0,
                }

            })
        } catch (e) {
            console.log('error', e);
        }

    }
    isLoadingRoom.value = false;
}
</script>
