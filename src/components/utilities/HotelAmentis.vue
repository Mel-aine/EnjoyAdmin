<template>
    <div>
        <main class="flex-grow container mx-auto  md:p">
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 class="text-xl font-semibold mb-4 text-gray-700">{{ t('hotelAmenities.selectCategories') }}</h2>
                <div class="flex flex-wrap gap-2 overflow-x-auto pb-2">
                    <button @click="selectCategory(null)"
                        :class="{ 'category-button': true, 'active': selectedCategory === null, 'bg-gray-200 text-gray-700 hover:bg-gray-300': selectedCategory !== null }"
                        class="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap">
                        {{ t('hotelAmenities.all') }}
                    </button>
                    <button v-for="category in categories" :key="category.id" @click="selectCategory(category.id)"
                        :class="{ 'category-button': true, 'active': selectedCategory === category.id, 'bg-gray-200 text-gray-700 hover:bg-gray-300': selectedCategory !== category.id }"
                        class="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap">
                        {{ t(category.name) }}
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-1 gap-8">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-xl font-semibold mb-4 text-gray-700">{{ t('hotelAmenities.chooseAmenities') }}</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                        <div v-for="amenity in filteredAmenities" :key="amenity.id"
                            class="amenity-card flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div class="flex items-center">
                                <i :class="['bi', amenity.icon, 'text-lg', 'mr-3', 'text-teal-600']"></i>
                                <div>
                                    <p class="font-medium text-gray-800">{{ t(amenity.name) }}</p>
                                    <p v-if="amenity.price > 0" class="text-sm text-gray-500">{{
                                        formatPrice(amenity.price) }}</p>
                                    <p v-else class="text-sm text-gray-500">{{ t('hotelAmenities.free') }}</p>
                                </div>
                            </div>
                            <button @click="toggleAmenity(amenity)"
                                :class="{ 'bg-teal-500 text-white hover:bg-teal-600': !isSelected(amenity.id), 'bg-red-500 text-white hover:bg-red-600': isSelected(amenity.id) }"
                                class="px-3 py-1 rounded-md text-sm transition-colors duration-200">
                                {{ isSelected(amenity.id) ? t('hotelAmenities.remove') : t('hotelAmenities.add') }}
                            </button>
                        </div>
                        <p v-if="filteredAmenities.length === 0 && selectedCategory !== null"
                            class="text-gray-500 text-center col-span-full">
                            {{ t('hotelAmenities.noAmenitiesForCategory') }}
                        </p>
                    </div>

                    <div class="mt-6 pt-4 border-t border-gray-200">
                        <button @click="showCustomAmenityForm = !showCustomAmenityForm"
                            class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/25 transition-colors duration-200 flex items-center justify-center">
                            <i class="bi bi-plus-circle mr-2"></i> {{ t('hotelAmenities.addCustomAmenity') }}
                        </button>
                        <div v-if="showCustomAmenityForm" class="mt-4 p-4 bg-blue-50 rounded-lg">
                            <h3 class="font-semibold text-blue-800 mb-3">{{ t('hotelAmenities.newAmenity') }}</h3>
                            <input type="text" v-model="customAmenityName"
                                :placeholder="t('hotelAmenities.amenityName')"
                                class="w-full p-2 border border-blue-200 rounded-md mb-2 focus:ring-blue-500 focus:border-blue-500">
                            <InputCurrency type="number" v-model.number="customAmenityPrice"
                                :placeholder="t('hotelAmenities.priceOptional')" />
                            <IconPicker v-model="customAmenityIcon" class="mt-2 mb-4" />
                            <button @click="addCustomAmenity" :disabled="!customAmenityName.trim()"
                                class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-5 transition-colors duration-200 disabled:opacity-50">
                                {{ t('hotelAmenities.add') }}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-xl font-semibold mb-4 text-gray-700">{{ t('hotelAmenities.selectedAmenities') }}
                    </h2>
                    <div class="max-h-96 overflow-y-auto pr-2">
                        <div v-if="selectedAmenities.length === 0" class="text-gray-500 text-center py-4">
                            {{ t('hotelAmenities.noAmenitiesSelected') }}
                        </div>
                        <table v-else class="min-w-full table-auto border-collapse">
                            <thead>
                                <tr class="table-header text-gray-700 text-sm uppercase font-semibold">
                                    <th class="py-2 px-4 text-left">{{ t('hotelAmenities.name') }}</th>
                                    <th class="py-2 px-4 text-right">{{ t('hotelAmenities.price') }}</th>
                                    <th class="py-2 px-4 text-center">{{ t('hotelAmenities.actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="amenity in selectedAmenities" :key="amenity.id"
                                    class="border-b border-gray-200 hover:bg-gray-50">
                                    <td class="py-2 px-4 flex items-center">
                                        <i :class="['bi', amenity.icon, 'text-lg', 'mr-2', 'text-teal-700']"
                                            v-if="amenity.icon"></i>
                                        <p class="font-medium text-gray-800">{{ t(amenity.name) }}</p>
                                    </td>
                                    <td class="py-2 px-4 text-right">
                                        <InputCurrency v-model.number="amenity.price"></InputCurrency>

                                    </td>
                                    <td class="py-2 px-4 text-center">
                                        <button @click="removeSelectedAmenity(amenity.id)"
                                            class="text-red-500 hover:text-red-700 p-1 rounded-full">
                                            <i class="bi bi-x-circle text-lg"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <button @click="saveAmenities" :disabled="selectedAmenities.length === 0"
                        class="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center">
                        <Spinner v-if="isLoading" class="mr-2" />
                        <span v-else class="flex items-center">
                            <i class="bi bi-save mr-2"></i> {{ t('hotelAmenities.saveAmenities') }}
                        </span>
                    </button>
                </div>
            </div>

            <section v-if="savedHotelAmenities.length > 0" class="mt-8 bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-700">{{ t('hotelAmenities.savedHotelAmenities') }}</h2>
                <div class="max-h-96 overflow-y-auto pr-2">
                    <table class="min-w-full table-auto border-collapse">
                        <thead>
                            <tr class="table-header text-gray-700 text-sm uppercase font-semibold">
                                <th class="py-2 px-4 text-left">{{ t('hotelAmenities.name') }}</th>
                                <th class="py-2 px-4 text-right">{{ t('hotelAmenities.price') }}</th>
                                <th class="py-2 px-4 text-center">{{ t('hotelAmenities.type') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="amenity in savedHotelAmenities" :key="amenity.id"
                                class="border-b border-gray-200 hover:bg-gray-50">
                                <td class="py-2 px-4 flex items-center">
                                    <i :class="['bi', amenity.icon, 'text-lg', 'mr-2', 'text-teal-700']"
                                        v-if="amenity.icon"></i>
                                    <p class="font-medium text-gray-800">{{ t(amenity.name) }}</p>
                                </td>
                                <td class="py-2 px-4 text-right">
                                    <span class="text-gray-800">{{ formatPrice(amenity.price) }}</span>
                                </td>
                                <td class="py-2 px-4 text-center">
                                    <span
                                        :class="{ 'bg-blue-100 text-blue-800': amenity.custom, 'bg-gray-100 text-gray-700': !amenity.custom }"
                                        class="px-2 py-1 rounded-full text-xs font-semibold">
                                        {{ amenity.custom ? t('hotelAmenities.custom') : t('hotelAmenities.standard') }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import InputCurrency from '../forms/FormElements/InputCurrency.vue';
import { updateService } from '@/services/api';
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import { onMounted } from 'vue';
import Spinner from '../spinner/Spinner.vue';
import IconPicker from './IconPicker.vue';
const { t } = useI18n()
const serviceStore = useServiceStore()

const toast = useToast()
const isLoading = ref(false)
const categories = ref([
    { id: "CAT001", name: "hotelAmenities.generalServices", description: "hotelAmenities.generalServicesDesc" },
    { id: "CAT002", name: "hotelAmenities.diningBar", description: "hotelAmenities.diningBarDesc" },
    { id: "CAT003", name: "hotelAmenities.wellnessLeisure", description: "hotelAmenities.wellnessLeisureDesc" },
    { id: "CAT004", name: "hotelAmenities.business", description: "hotelAmenities.businessDesc" },
    { id: "CAT005", name: "hotelAmenities.mobility", description: "hotelAmenities.mobilityDesc" },
    { id: "CAT006", name: "hotelAmenities.practicalServices", description: "hotelAmenities.practicalServicesDesc" },
    { id: "CAT007", name: "hotelAmenities.familyChildren", description: "hotelAmenities.familyChildrenDesc" },
    { id: "CAT008", name: "hotelAmenities.pets", description: "hotelAmenities.petsDesc" }
]);

const hotelAmenities = ref([
    { id: "HTL001", name: "hotelAmenities.reception", category_id: "CAT001", description: "hotelAmenities.receptionDesc", available: true, price: 0, icon: "bi-clock" },
    { id: "HTL002", name: "hotelAmenities.concierge", category_id: "CAT001", description: "hotelAmenities.conciergeDesc", available: true, price: 0, icon: "bi-person-badge" },
    { id: "HTL004", name: "hotelAmenities.restaurant", category_id: "CAT002", description: "hotelAmenities.restaurantDesc", available: true, price: 0, icon: "bi-egg-fried" },
    { id: "HTL005", name: "hotelAmenities.buffetBreakfast", category_id: "CAT002", description: "hotelAmenities.buffetBreakfastDesc", available: true, price: 0, icon: "bi-cup-straw" },
    { id: "HTL006", name: "hotelAmenities.roomService", category_id: "CAT002", description: "hotelAmenities.roomServiceDesc", available: true, price: 0, icon: "bi-door-open" },
    { id: "HTL007", name: "hotelAmenities.swimmingPool", category_id: "CAT003", description: "hotelAmenities.swimmingPoolDesc", available: true, price: 0, icon: "bi-droplet-half" },
    { id: "HTL008", name: "hotelAmenities.fitnessCenter", category_id: "CAT003", description: "hotelAmenities.fitnessCenterDesc", available: true, price: 0, icon: "bi-heart-pulse" },
    { id: "HTL009", name: "hotelAmenities.spaSauna", category_id: "CAT003", description: "hotelAmenities.spaSaunaDesc", available: false, price: 0, icon: "bi-fire" },
    { id: "HTL011", name: "hotelAmenities.meetingRooms", category_id: "CAT004", description: "hotelAmenities.meetingRoomsDesc", available: true, price: 0, icon: "bi-people" },
    { id: "HTL012", name: "hotelAmenities.wifiPublic", category_id: "CAT004", description: "hotelAmenities.wifiPublicDesc", available: true, price: 0, icon: "bi-wifi" },
    { id: "HTL013", name: "hotelAmenities.freeParking", category_id: "CAT005", description: "hotelAmenities.freeParkingDesc", available: true, price: 0, icon: "bi-car-front" },
    { id: "HTL014", name: "hotelAmenities.airportShuttle", category_id: "CAT005", description: "hotelAmenities.airportShuttleDesc", available: true, price: 0, icon: "bi-bus-front" },
    { id: "HTL015", name: "hotelAmenities.laundryService", category_id: "CAT006", description: "hotelAmenities.laundryServiceDesc", available: true, price: 0, icon: "bi-basket" },
    { id: "HTL018", name: "hotelAmenities.playArea", category_id: "CAT007", description: "hotelAmenities.playAreaDesc", available: true, price: 0, icon: "bi-emoji-smile" },
    { id: "HTL020", name: "hotelAmenities.petsAllowed", category_id: "CAT008", description: "hotelAmenities.petsAllowedDesc", available: true, price: 0, icon: "bi-paw" }
]);

const selectedCategory = ref(null);
const selectedAmenities = ref([]);
const savedHotelAmenities = ref([]);

const customAmenityName = ref('');
const customAmenityIcon = ref('');
const customAmenityPrice = ref(0);
const showCustomAmenityForm = ref(false);

const filteredAmenities = computed(() => {
    if (selectedCategory.value === null) {
        return hotelAmenities.value;
    }
    return hotelAmenities.value.filter(
        amenity => amenity.category_id === selectedCategory.value
    );
});

const totalPrice = computed(() => {
    return selectedAmenities.value.reduce((sum, amenity) => sum + (amenity.price || 0), 0);
});

const isSelected = (amenityId) => {
    return selectedAmenities.value.some(item => item.id === amenityId);
};

const selectCategory = (categoryId) => {
    selectedCategory.value = categoryId;
};

const toggleAmenity = (amenity) => {
    const index = selectedAmenities.value.findIndex(item => item.id === amenity.id);
    if (index > -1) {
        selectedAmenities.value.splice(index, 1);
    } else {
        selectedAmenities.value.push({
            id: amenity.id,
            name: amenity.name,
            price: amenity.price,
            icon: amenity.icon,
            custom: false
        });
    }
};

const updateAmenityPrice = (amenityId, newPrice) => {
    const amenity = selectedAmenities.value.find(item => item.id === amenityId);
    if (amenity) {
        amenity.price = parseFloat(newPrice) || 0;
    }
};

const addCustomAmenity = () => {
    if (customAmenityName.value.trim()) {
        const newId = `CUSTOM_${Date.now()}`;
        selectedAmenities.value.push({
            id: newId,
            name: customAmenityName.value.trim(),
            price: parseFloat(customAmenityPrice.value) || 0,
            icon: `bi bi-${customAmenityIcon.value}`,
            custom: true
        });
        customAmenityName.value = '';
        customAmenityPrice.value = 0;
        showCustomAmenityForm.value = false;
    }
};

const removeSelectedAmenity = (amenityId) => {
    selectedAmenities.value = selectedAmenities.value.filter(item => item.id !== amenityId);
};

const saveAmenities = async () => {
    savedHotelAmenities.value = JSON.parse(JSON.stringify(selectedAmenities.value));
    isLoading.value = true
    try {
        const serviceId = serviceStore.serviceId

        const payload = {
            facilities: JSON.stringify(selectedAmenities.value),
        }
        console.log('payloadServiceupdate', payload)

        await updateService(serviceId, payload)

        toast.success(t('toast.SucessUpdate'))
    } catch (error) {
        console.error('Erreur lors de la mise à jour des paramètres :', error)
        toast.error(t('toast.updateError'))
    } finally {
        isLoading.value = false
    }
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-CM', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};
onMounted(() => {
    console.log('serviceStore.currentService', serviceStore.currentService)
    savedHotelAmenities.value = JSON.parse(serviceStore.currentService).facilities || [];
    selectedAmenities.value = JSON.parse(serviceStore.currentService).facilities || [];
})
</script>
