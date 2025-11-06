<template>
  <div class="flex justify-end">
    <BasicButton @click="showFilter = true" variant="secondary" :icon="Filter" :label="$t('reservationsList.filterSectionTitle')" />
  </div>

  <RightSideModal :is-open="showFilter" :title="$t('filtersGuest.title')" @close="showFilter = false">
    <div class="p-4 space-y-6">
      <!-- Search by Name/Email/Phone (texte libre) -->
      <div>
        <Input
          :lb="$t('filtersGuest.searchLabel')"
          :placeholder="$t('filtersGuest.searchPlaceholder')"
          v-model="filters.search"
        />
      </div>

      <!-- Filtre par Statut VIP -->
      <div>
        <Select
          :lb="$t('filtersGuest.vipStatus')"
          v-model="filters.vipStatus"
          :options="vipStatusOptions"
        />
      </div>

      <!-- Filtre par Type de Client -->
      <div>
        <Select
          :lb="$t('filtersGuest.guestType')"
          v-model="filters.guestType"
          :options="guestTypeOptions"
        />
      </div>

      <!-- Filtre par Nationalité -->
      <div>
        <InputCountries
          :lb="$t('filtersGuest.nationality')"
          v-model="filters.nationality"
        />
      </div>

      <!-- Boutons d'action -->
      <div class="pt-4 border-t flex justify-end gap-3">
        <BasicButton @click="clearFilters" variant="light" :icon="XCircle" :label="$t('filtersGuest.clear')" />
        <BasicButton @click="applyFilters" variant="primary" :icon="Search" :label="$t('filtersGuest.apply')" />
      </div>
    </div>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Filter, Search, XCircle } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import RightSideModal from '@/components/modal/RightSideModal.vue';
import { defineAsyncComponent } from 'vue';
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'));
import Select from '@/components/forms/FormElements/Select.vue';
import InputCountries from '@/components/forms/FormElements/InputCountries.vue';
import BasicButton from '@/components/buttons/BasicButton.vue';

const { t } = useI18n();

const emit = defineEmits(['filter']);

const showFilter = ref(false);

// État des filtres
const filters = ref({
  search: '',      // Texte libre
  vipStatus: '',   // Valeur du select
  guestType: '',   // Valeur du select
  nationality: '', // Valeur du composant pays
});

// Options pour les selects (vous pouvez les rendre dynamiques si besoin)
const vipStatusOptions = computed(() => [
  { label: t('filtersGuest.all'), value: '' },
  { label: t('vipStatus.bronze'), value: 'bronze' },
  { label: t('vipStatus.silver'), value: 'silver' },
  { label: t('vipStatus.gold'), value: 'gold' },
  { label: t('vipStatus.platinum'), value: 'platinum' },
  { label: t('vipStatus.diamond'), value: 'diamond' },
  { label: t('vipStatus.none'), value: 'none' },
]);

const guestTypeOptions = computed(() => [
  { label: t('filtersGuest.all'), value: '' },
  { value: 'travel_agent', label: 'Travel Agent' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'individual', label: 'Individual' }
]);


const applyFilters = () => {
  const apiFilters = {
    search: filters.value.search,
    vip_status: filters.value.vipStatus,
    guest_type: filters.value.guestType,
    nationality: filters.value.nationality,
  };
   Object.keys(apiFilters).forEach(key => {
    if (!apiFilters[key as keyof typeof apiFilters]) {
      delete apiFilters[key as keyof typeof apiFilters];
    }
  });
  emit('filter', apiFilters);
  showFilter.value = false;
};

const clearFilters = () => {
  filters.value = {
    search: '',
    vipStatus: '',
    guestType: '',
    nationality: '',
  };
  applyFilters();
};
</script>
