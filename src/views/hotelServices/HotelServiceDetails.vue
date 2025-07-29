<template>
    <AdminLayout>
        <FullScreenLayout>
            <div class="container mx-auto px-4 py-8">
                <!-- Back button -->
                <div class="mb-8 slide-in">
                    <div class="flex items-center gap-4 mb-4">
                        <button @click="goBack"
                            class="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded-lg transition-all duration-200 shadow">
                            ← {{ $t('Back') }}
                        </button>
                    </div>
                </div>

                <!-- Details display -->
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden" v-if="amenity">
                    <!-- Header -->
                    <div class="bg-gradient-to-r from-with to-white p-6 text-white">
                        <div class="flex items-center space-x-4">
                            <div
                                class="w-16 h-16 bg-primary bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm ">
                                <component :is="HotelIcon" class="w-8 h-8 text-black" />
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold text-black">{{ amenity.name }}</h1>
                                <p class="text-sm opacity-90 text-black">{{ $t('amenities') }}</p>
                                <span
                                    :class="['inline-flex items-center  px-3 py-1 rounded-full text-sm font-medium mt-2', getStatusColor(amenity.status!)]">
                                    {{ $t(amenity.status??'') }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <!-- Navigation Tabs -->
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
                    <div class="p-6" v-if="activeTab=='details'">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-gray-50 rounded-lg p-4 border">
                                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                                    <InfoIcon class="w-5 h-5 mr-2 text-blue-600" />
                                    {{ $t('Basic_Information') }}
                                </h3>
                                <div class="space-y-2">
                                    <DetailRow :label="$t('Name')" :value="amenity.name || 'N/A'" />
                                    <DetailRow :label="$t('Description')" :value="amenity.description || 'N/A'" />
                                    <DetailRow :label="$t('status')" :value="$t(amenity.status??'N/A')" />
                                    <DetailRow :label="$t('source_type')"
                                        :value="$t((amenity.source_type?.toLowerCase() || 'N/A'))" />
                                    <DetailRow v-if="amenity.source_type === 'External'"
                                        :label="$t('externalReferenceCode')"
                                        :value="amenity.external_system_id || 'N/A'" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <AmenityProduct  v-if="activeTab==='products'"/>
                </div>
                <OverLoading v-if="isLoading" />
            </div>
        </FullScreenLayout>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue';
import OverLoading from '@/components/spinner/OverLoading.vue';
import { getAmenityCategoryById } from '@/services/api';
import { defaultAmenityCategoryPayload, type AmenityCategoryPayload } from '@/utils/models';
import DetailRow from '@/views/Room/DetailRow.vue';
import InfoIcon from '@/icons/InfoIcon.vue';
import { ClockIcon, HotelIcon,PackageIcon } from 'lucide-vue-next';
import AmenityProduct from './AmenityProduct.vue';
const activeTab = ref<string>('details')
const tabs = computed(() => [
  { id: 'details', label: t('tab.details'), icon: InfoIcon },
  { id: 'products', label: t('products'), icon: PackageIcon },
  { id: 'history', label: t('tab.history'), icon: ClockIcon},
])
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const amenity = ref<AmenityCategoryPayload>(defaultAmenityCategoryPayload());
const isLoading = ref(false);

const amenityId = route.params.id as string;

const fetchAmenityDetails = async () => {
    isLoading.value = true;
    try {
        const response = await getAmenityCategoryById(amenityId);
        amenity.value = response.data;
    } catch (error) {
        console.error('Failed to fetch amenity details:', error);
    } finally {
        isLoading.value = false;
    }
};

const goBack = () => {
    router.back();
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800';
        case 'inactive':
            return 'bg-yellow-100 text-yellow-800';
        case 'archived':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

onMounted(() => {
    fetchAmenityDetails();
});
</script>

<style scoped>
.slide-in {
    animation: slideIn 0.6s ease-out;
}

@keyframes slideIn {
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
