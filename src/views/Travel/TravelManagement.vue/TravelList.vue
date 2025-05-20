<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {  PlusCircle } from 'lucide-vue-next';
import { Car} from 'lucide-vue-next';
// import { format, parseISO } from 'date-fns';
// import { fr } from 'date-fns/locale';
import Input from '@/components/forms/FormElements/Input.vue';
import Select from '@/components/forms/FormElements/Select.vue';
import TableOne from '@/components/tables/TableOne.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import Modal from '@/components/profile/Modal.vue';

interface Voyage {
  id: number;
  departureDate: string; // Date de départ
  arrivalDate: string;   // Date d'arrivée
  vehicle: string;       // Véhicule
  price: number;         // Prix
  itinerary: string;     // Itinéraire
  driver: string;        // Chauffeur
  duration: number;      // Durée en jours
  status: 'planned' | 'ongoing' | 'completed'; // Statut
}

// données
const voyages = ref<Voyage[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const statusFilter = ref<'all' | 'planned' | 'ongoing' | 'completed'>('all');

const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);

const currentVoyage = ref<Voyage | null>(null);

const { t } = useI18n();

const isStatusDropdownOpen = ref(false);

const toggleStatusDropdown = () => {
  isStatusDropdownOpen.value = !isStatusDropdownOpen.value;
};

const setStatusFilter = (status:any) => {
  statusFilter.value = status;
  isStatusDropdownOpen.value = false;
};

const newVoyage = ref<Omit<Voyage, 'id'>>({
  departureDate: '',
  arrivalDate: '',
  vehicle: '',
  price: 0,
  itinerary: '',
  driver: '',
  duration: 0,
  status: 'planned',
});

// Chargement des données simulé
onMounted(() => {
  setTimeout(() => {
    voyages.value = [
      { id: 1, departureDate: '2025-06-15', arrivalDate: '2025-06-20', vehicle: 'Bus 1', price: 150, itinerary: 'Douala - Yaoundé', driver: 'Jean Dupont', duration: 5, status: 'planned' },
      { id: 2, departureDate: '2025-07-20', arrivalDate: '2025-07-23', vehicle: 'Bus 2', price: 120, itinerary: 'Yaoundé - Limbe', driver: 'Marie Curie', duration: 3, status: 'ongoing' },
      { id: 3, departureDate: '2025-08-10', arrivalDate: '2025-08-17', vehicle: 'Bus 3', price: 200, itinerary: 'Limbe - Douala', driver: 'Paul Martin', duration: 7, status: 'completed' },
    ];
    loading.value = false;
  }, 500);
});


const status = computed(()=>[
  { value: 'all', label: t('All') },
  { value: 'planned', label: t('planned') },
  { value: 'ongoing', label:t('ongoing') },
  { value: 'completed', label:t('complete') },
]);

const titles = computed(() => ([
  { name: 'departureDate', label: t('Date de départ'), type: 'date', filterable: true },
  { name: 'arrivalDate', label: t('Date d\'arrivée'), type: 'date', filterable: false },
  { name: 'vehicle', label: t('Véhicule'), type: 'text', filterable: false },
  { name: 'price', label: t('Prix'), type: 'number', filterable: false },
  { name: 'itinerary', label: t('Itinéraire'), type: 'text', filterable: false },
  { name: 'driver', label: t('Chauffeur'), type: 'text', filterable: false },
  { name: 'duration', label: t('Durée (jours)'), type: 'number', filterable: false },
  { name: 'status', label: t('Statut'), type: 'badge', filterable: true },
  {
    name: 'Actions',
    type: 'action',
    label: t('Actions'),
    colored: true,
    actions: [
      {
        name: "edit",
        icone: `
          <svg class="h-6 w-6 text-blue-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
          </svg>
        `,
        event: 'edit',
      },
      {
        name: "delete",
        icone: `
          <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        `,
        event: 'delete',
      }
    ]
  }
]));

// formatage des dates
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy', { locale: fr });
  } catch {
    return dateStr;
  }
};

const filteredVoyages = computed(() => {
  return voyages.value.filter(voyage => {
    const matchesSearch = voyage.itinerary.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = statusFilter.value === 'all' || voyage.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const datas = computed(() =>
  filteredVoyages.value.map(v => ({
    id: v.id,
    departureDate: formatDate(v.departureDate),
    arrivalDate: formatDate(v.arrivalDate),
    vehicle: v.vehicle,
    price: v.price,
    itinerary: v.itinerary,
    driver: v.driver,
    duration: `${v.duration} jours`,
    status: getStatusBadge(v.status),
  }))
);

const openAddModal = () => {
  isAddModalOpen.value = true;
};

const closeAddModal = () => {
  isAddModalOpen.value = false;
  newVoyage.value = { departureDate: '', arrivalDate: '', vehicle: '', price: 0, itinerary: '', driver: '', duration: 0, status: 'planned' };
};

const addVoyage = () => {
  // validation simple
  if (newVoyage.value.departureDate > newVoyage.value.arrivalDate) {
    alert(t("La date d'arrivée doit être après la date de départ."));
    return;
  }
  if (newVoyage.value.price < 0) {
    alert(t("Le prix doit être positif."));
    return;
  }
  const id = voyages.value.length > 0 ? Math.max(...voyages.value.map(v => v.id)) + 1 : 1;
  voyages.value.push({ ...newVoyage.value, id });
  closeAddModal();
};

const openEditModal = (voyage: Voyage) => {
  currentVoyage.value = { ...voyage };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  currentVoyage.value = null;
};

const saveEdit = () => {
  if (!currentVoyage.value) return;

  if (currentVoyage.value.departureDate > currentVoyage.value.arrivalDate) {
    alert(t("La date d'arrivée doit être après la date de départ."));
    return;
  }
  if (currentVoyage.value.price < 0) {
    alert(t("Le prix doit être positif."));
    return;
  }

  const index = voyages.value.findIndex(v => v.id === currentVoyage.value!.id);
  if (index !== -1) {
    voyages.value[index] = { ...currentVoyage.value };
  }
  closeEditModal();
};

const deleteVoyage = (id: number) => {
  if (confirm(t("Voulez-vous vraiment supprimer ce voyage ?"))) {
    voyages.value = voyages.value.filter(v => v.id !== id);
  }
};

const handleAction = ({ event, row }: { event: string; row: any }) => {
  const voyage = voyages.value.find(v => v.id === row.id);
  if (!voyage) return;

  if (event === 'edit') openEditModal(voyage);
  if (event === 'delete') deleteVoyage(voyage.id);
};

const filterOptions = computed(()=>([
      {
          name: t('All'),
          api: '',
      },
      {
          name: t('today'),
          api: 'today',
      },
      {
          name: t('thisweek'),
          api: 'thisweek',
      },
      {
          name: t('lastweek'),
          api: 'lastweek',
      },
      {
          name: t('thismonth'),
          api: 'thismonth',
      }

  ]));

  const getStatusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    completed: {
      label: 'Complete',
      bg: 'bg-green-100',
      text: 'text-green-800'
    },
    planned: {
      label: 'Prévu',
      bg: 'bg-pink-100',
      text: 'text-pink-800'
    },
    ongoing: {
      label: 'En cours',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800'
    }
  };
  return map[status] || {
    label: status,
    bg: 'bg-blue-100',
    text: 'text-blue-800'
  };
};
</script>
<template>
  <AdminLayout>
    <div class="p-6 min-h-screen">
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-semibold text-gray-900 flex items-center">
          <Car class="h-8 w-8 mr-2 text-orange-600" />
          {{ t('Tous les voyages') }}
        </h1>
        <button
          @click="openAddModal"
          class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg> -->
          <PlusCircle class="mr-2"/>
          {{ t('Ajouter un voyage') }}
        </button>
      </div>

      <!-- Filtres et recherche -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              :placeholder="t('Rechercher par itinéraire...')"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <div class="flex space-x-2">
            <div class="relative">
              <button
                class="border border-purple-500 bg-white rounded-lg text-purple-500 px-4 py-2 flex items-center gap-2"
                @click="toggleStatusDropdown"
              >
                <span>
                  {{ $t(
                    statusFilter === 'all' ? 'Tous les statuts'
                    : statusFilter === 'ongoing' ? 'En cours'
                    : statusFilter === 'planned' ? 'Prévu'
                    : 'Complete'
                  ) }}
                </span>
                <svg class="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z"/>
                  <path d="M6 9l6 6l6 -6"/>
                </svg>
              </button>

            <div v-if="isStatusDropdownOpen" class="z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-56 absolute right-0">
              <ul class="py-2 text-sm text-gray-700">
                <li>
                  <button @click="setStatusFilter('all')" class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                    {{ $t('Tous les statuts') }}
                  </button>
                </li>
                <li>
                  <button @click="setStatusFilter('ongoing')" class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                    {{ $t('En cours ') }}
                  </button>
                </li>
                <li>
                  <button @click="setStatusFilter('planned')" class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                    {{ $t('Prévu') }}
                  </button>
                </li>
                <li>
                  <button @click="setStatusFilter('completed')" class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                    {{ $t('Complete') }}
                  </button>
                </li>
              </ul>
            </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Tableau des voyages -->
      <div class="bg-white overflow-hidden shadow-sm rounded-lg">
        <div v-if="loading" class="p-6 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-orange-500 border-gray-200"></div>
          <p class="mt-2 text-gray-500">{{ t('Chargement...') }}</p>
        </div>

        <div v-else-if="filteredVoyages.length === 0" class="p-6 text-center">
          <p class="text-gray-500">{{ t('Aucun itinéraire trouvé.') }}</p>
        </div>
        <div v-else>
      
            <TableOne
              :items="titles"
              :datas="datas"
              :filterable="true"
              :loading="loading"
              :options="filterOptions"
              :pagination="true"
              @action="handleAction"
              class="bg-white rounded shadow-sm"
            />
        </div>
      </div>
    </div>
  </AdminLayout>
  <Modal v-if="isAddModalOpen" @close="closeAddModal">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <!-- close btn -->
          <button
            @click="isAddModalOpen = false"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700  dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
          >
            <svg
              class="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                fill=""
              />
            </svg>
          </button>
          <div class="px-2 pr-14">
            <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ $t('Add Travel') }}
            </h4>

          </div>
          <form class="flex flex-col">
            <div class="custom-scrollbar h-[520px] overflow-y-auto p-2">
              <div>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Input :lb="$t('Date de depart')"  :inputType="'date'"  :id="'name'" :forLabel="'name'" />
                  </div>

                  <div>
                    <Input :lb="$t('Date d arrivee')"  :inputType="'date'"  :id="'date'" :forLabel="'date'" />
                  </div>
                  <div>
                    <Select :lb="$t('vehicule')" />
                  </div>
                  <div>
                    <Input :lb="$t('price')"  :inputType="'number'" :id="'last'" :forLabel="'last'" />
                  </div>

                  <div>
                    <Select :lb="$t('itineraire')" />
                  </div>
                  <div>
                    <Select :lb="$t('driver')"  />
                  </div>
                  <div>
                    <Input :lb="$t('duree')" :inputType = "'number'"   :id="'stop'" :forLabel="'stop'" :min="'1'" />
                  </div>
                  <div>
                    <Select :lb="$t('status')" :options="status" />
                  </div>
                </div>
              </div>

            </div>
            <div class="flex items-center gap-3 px-2 mt-2 lg:justify-end">
              <button
                @click="isAddModalOpen = false"
                type="button"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                {{ $t('Cancel') }}
              </button>
              <button

                type="button"
                class="flex w-full justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 sm:w-auto"
              >
               {{ $t('Save') }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
</template>


<style scoped>
/* Ajoute ici des styles si besoin */
</style>
