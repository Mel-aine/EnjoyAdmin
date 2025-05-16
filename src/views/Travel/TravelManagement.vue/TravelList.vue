<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { PlusCircle } from 'lucide-vue-next';
// import { format, parseISO } from 'date-fns';
// import { fr } from 'date-fns/locale';

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

const setStatusFilter = (status: any) => {
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

const statusLabels = {
  all: t('Tous les statuts'),
  planned: t('Prévu'),
  ongoing: t('En cours'),
  completed: t('Terminé'),
};

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
    status: v.status,
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
</script>

<template>
  <AdminLayout>
    <div class="p-6 min-h-screen flex flex-col">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestion des Voyages</h1>
        <button @click="openAddModal" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center">
          <PlusCircle class="mr-2" />
          Ajouter un voyage
        </button>
      </div>

      <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div class="relative w-full md:w-1/3">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Recherche par itinéraire"
              class="w-full rounded border px-3 py-2"
              aria-label="Recherche par itinéraire"
            />
          </div>
          <div class="relative" @click="isStatusDropdownOpen = false">
            <button
              @click="toggleStatusDropdown"
              class="px-4 py-2 border rounded cursor-pointer w-full md:w-auto flex justify-between items-center"
              aria-haspopup="listbox"
              :aria-expanded="isStatusDropdownOpen.toString()"
            >
              {{ statusLabels[statusFilter] }}
              <svg
                class="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul
              v-if="isStatusDropdownOpen"
              class="absolute z-10 bg-white border rounded mt-1 w-full md:w-48"
              role="listbox"
              tabindex="-1"
            >
              <li
                v-for="status in ['all', 'planned', 'ongoing', 'completed']"
                :key="status"
                @click="setStatusFilter(status)"
                class="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                role="option"
                :aria-selected="statusFilter === status"
              >
                {{ statusLabels[status] }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <TableOne
        :items="titles"
        :datas="datas"
        :filterable="true"
        :loading="loading"
        @action="handleAction"
        class="bg-white rounded shadow-sm"
      />

      <!-- Modal Ajout -->
      <Modal v-if="isAddModalOpen" @close="closeAddModal" title="Ajouter un voyage">
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
        <form @submit.prevent="addVoyage" class="space-y-4">
          <div>
            <label for="departureDate" class="block font-medium">Date de départ</label>
            <input id="departureDate" v-model="newVoyage.departureDate" type="date" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="arrivalDate" class="block font-medium">Date d'arrivée</label>
            <input id="arrivalDate" v-model="newVoyage.arrivalDate" type="date" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="vehicle" class="block font-medium">Véhicule</label>
            <input id="vehicle" v-model="newVoyage.vehicle" type="text" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="price" class="block font-medium">Prix</label>
            <input id="price" v-model.number="newVoyage.price" type="number" min="0" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="itinerary" class="block font-medium">Itinéraire</label>
            <input id="itinerary" v-model="newVoyage.itinerary" type="text" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="driver" class="block font-medium">Chauffeur</label>
            <input id="driver" v-model="newVoyage.driver" type="text" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="duration" class="block font-medium">Durée (jours)</label>
            <input id="duration" v-model.number="newVoyage.duration" type="number" min="1" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="status" class="block font-medium">Statut</label>
            <select id="status" v-model="newVoyage.status" required class="w-full border rounded px-3 py-2">
              <option value="planned">Prévu</option>
              <option value="ongoing">En cours</option>
              <option value="completed">Terminé</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeAddModal" class="px-4 py-2 border rounded">Annuler</button>
            <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Ajouter</button>
          </div>
        </form>
        </div>
        </template>
      </Modal>

      <!-- Modal Édition -->
      <Modal v-if="isEditModalOpen" @close="closeEditModal" title="Modifier le voyage">
        <form @submit.prevent="saveEdit" class="space-y-4" v-if="currentVoyage">
          <div>
            <label for="editDepartureDate" class="block font-medium">Date de départ</label>
            <input id="editDepartureDate" v-model="currentVoyage.departureDate" type="date" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="editArrivalDate" class="block font-medium">Date d'arrivée</label>
            <input id="editArrivalDate" v-model="currentVoyage.arrivalDate" type="date" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="editVehicle" class="block font-medium">Véhicule</label>
            <input id="editVehicle" v-model="currentVoyage.vehicle" type="text" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="editPrice" class="block font-medium">Prix</label>
            <input id="editPrice" v-model.number="currentVoyage.price" type="number" min="0" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="editItinerary" class="block font-medium">Itinéraire</label>
            <input id="editItinerary" v-model="currentVoyage.itinerary" type="text" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="editDriver" class="block font-medium">Chauffeur</label>
            <input id="editDriver" v-model="currentVoyage.driver" type="text" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="editDuration" class="block font-medium">Durée (jours)</label>
            <input id="editDuration" v-model.number="currentVoyage.duration" type="number" min="1" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="editStatus" class="block font-medium">Statut</label>
            <select id="editStatus" v-model="currentVoyage.status" required class="w-full border rounded px-3 py-2">
              <option value="planned">Prévu</option>
              <option value="ongoing">En cours</option>
              <option value="completed">Terminé</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeEditModal" class="px-4 py-2 border rounded">Annuler</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enregistrer</button>
          </div>
        </form>

      </Modal>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Ajoute ici des styles si besoin */
</style>
