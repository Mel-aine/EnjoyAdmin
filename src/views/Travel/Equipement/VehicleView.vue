
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {PlusCircle } from 'lucide-vue-next';

import TableOne from '@/components/tables/TableOne.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import Modal from '@/components/profile/Modal.vue';


interface Vehicle {
  id: number;
  registrationNumber: string;
  model: string;
  brand: string;
  year: number;
  capacity: number;
  status: 'available' | 'in-use' | 'maintenance';
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
}

const vehicles = ref<Vehicle[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('all');
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const currentVehicle = ref<Vehicle | null>(null);
const isStatusDropdownOpen = ref(false);
const { t } = useI18n();
// Nouvelle entrée de véhicule
const newVehicle = ref<Omit<Vehicle, 'id'>>({
  registrationNumber: '',
  model: '',
  brand: '',
  year: new Date().getFullYear(),
  capacity: 0,
  status: 'available',
  lastMaintenanceDate: '',
  nextMaintenanceDate: ''
});

const toggleStatusDropdown = () => {
  isStatusDropdownOpen.value = !isStatusDropdownOpen.value;
};

const setStatusFilter = (status:any) => {
  statusFilter.value = status;
  isStatusDropdownOpen.value = false;
  console.log("status",status)
};
// Charger les données
onMounted(async () => {
  // Simuler un chargement de données
  setTimeout(() => {
    vehicles.value = [
      {
        id: 1,
        registrationNumber: 'AB-123-CD',
        model: 'Tourismo',
        brand: 'Mercedes-Benz',
        year: 2022,
        capacity: 49,
        status: 'available',
        lastMaintenanceDate: '2024-04-15',
        nextMaintenanceDate: '2024-07-15'
      },
      {
        id: 2,
        registrationNumber: 'EF-456-GH',
        model: 'Travego',
        brand: 'Mercedes-Benz',
        year: 2020,
        capacity: 55,
        status: 'in-use',
        lastMaintenanceDate: '2024-03-10',
        nextMaintenanceDate: '2024-06-10'
      },
      {
        id: 3,
        registrationNumber: 'IJ-789-KL',
        model: 'Lions Coach',
        brand: 'MAN',
        year: 2021,
        capacity: 52,
        status: 'maintenance',
        lastMaintenanceDate: '2024-05-01',
        nextMaintenanceDate: '2024-08-01'
      }
    ];
  }, 500);
});

const titles = computed(()=>([
      {
          name: 'registrationNumber',
          label: t('immatriculation'),
          type: 'text',
          event: "view",
          filterable: true,
      },
      {
          name: 'model',
          type: "text",
          label: t('model'),
          filterable: false,
      },
      {
          name: 'brand',
          type: "text",
          label: t('marque'),
          filterable: false,
      },
      {
          name: 'year',
          type: "text",
          label: t('annee'),
          filterable: false,
      },
      {
          name: 'capacity',
          type: "text",
          label: t('capacity'),
          filterable: false,
      },
      {
        name: 'status',
        label: t('Statut'),
        type: 'badge',
        filterable: true,
      },
      {
          name: 'lastMaintenanceDate',
          type: "text",
          label: t('derniere maintenance'),
          filterable: false,
      },
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

// Véhicules filtrés
const filteredVehicles = computed(() => {
  return vehicles.value.filter(vehicle => {
    // Filtrer par recherche
    const matchesSearch = vehicle.registrationNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchQuery.value.toLowerCase());

    // Filtrer par statut
    const matchesStatus = statusFilter.value === 'all' || vehicle.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});
console.log("hhh", vehicles.value)

const datas = computed(() =>
  vehicles.value.map(vehicle => ({
    registrationNumber: vehicle.registrationNumber,
    model: vehicle.model,
    brand: vehicle.brand,
    year: vehicle.year,
    capacity: vehicle.capacity,
    status: getVehicleStatusBadge(vehicle.status),
    lastMaintenanceDate: vehicle.lastMaintenanceDate,
    Actions: vehicle.id // ou tout autre identifiant pour les actions
  }))
);


const getVehicleStatusBadge = (status: string) => {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    available: {
      label: 'Disponible',
      bg: 'bg-green-100',
      text: 'text-green-800'
    },
    'in-use': {
      label: 'En service',
      bg: 'bg-blue-100',
      text: 'text-blue-800'
    },
    maintenance: {
      label: 'Maintenance',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800'
    }
  };

  return map[status] || {
    label: status,
    bg: 'bg-gray-100',
    text: 'text-gray-800'
  };
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
// Fonctions pour la gestion des véhicules
const openAddModal = () => {
  isAddModalOpen.value = true;
};

const closeAddModal = () => {
  isAddModalOpen.value = false;
  // Réinitialiser le formulaire
  newVehicle.value = {
    registrationNumber: '',
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    capacity: 0,
    status: 'available',
    lastMaintenanceDate: '',
    nextMaintenanceDate: ''
  };
};

const addVehicle = () => {
  const vehicleToAdd = {
    ...newVehicle.value,
    id: vehicles.value.length > 0 ? Math.max(...vehicles.value.map(v => v.id)) + 1 : 1
  };
  vehicles.value.push(vehicleToAdd);
  closeAddModal();
};

const openEditModal = (vehicle: Vehicle) => {
  currentVehicle.value = { ...vehicle };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  currentVehicle.value = null;
};

const saveEditedVehicle = () => {
  if (!currentVehicle.value) return;

  const index = vehicles.value.findIndex(v => v.id === currentVehicle.value?.id);
  if (index !== -1) {
    vehicles.value[index] = { ...currentVehicle.value };
  }

  closeEditModal();
};

const openDeleteModal = (vehicle: Vehicle) => {
  currentVehicle.value = vehicle;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  currentVehicle.value = null;
};

const deleteVehicle = () => {
  if (!currentVehicle.value) return;

  vehicles.value = vehicles.value.filter(v => v.id !== currentVehicle.value?.id);
  closeDeleteModal();
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'in-use':
      return 'bg-purple-100 text-purple-800';
    case 'maintenance':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'available':
      return 'Disponible';
    case 'in-use':
      return 'En service';
    case 'maintenance':
      return 'En maintenance';
    default:
      return status;
  }
};
</script>

<template>
  <AdminLayout>
  <div class="p-6 h-screen">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Véhicules</h1>
      <button @click="openAddModal" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center">
        <PlusCircle class="mr-2"/>
        Ajouter un véhicule
      </button>
    </div>

    <!-- Filtres et recherche -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher par immatriculation, modèle..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <div class="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="sm:w-64">
        <!-- <div class="relative">
          <select
            v-model="statusFilter"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="in-use">En service</option>
            <option value="maintenance">En maintenance</option>
          </select>
          <div class="absolute left-3 top-2.5 text-gray-400">
             <Filter  />
          </div>
        </div> -->
        <div class="relative">
              <button
                class="border border-purple-500 bg-white rounded-lg text-purple-500 px-4 py-2 flex items-center gap-2"
                @click="toggleStatusDropdown"
              >

                <span>
                  {{ $t(
                    statusFilter === 'all' ? 'Tous les statuts'
                    : statusFilter === 'available' ? 'Disponible'
                    : statusFilter === 'in-use' ? 'En service'
                    : 'En maintenance'
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
                  <button @click="setStatusFilter('available')" class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                    {{ $t('Disponible') }}
                  </button>
                </li>
                <li>
                  <button @click="setStatusFilter('in-use')" class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                    {{ $t('En service') }}
                  </button>
                </li>
                <li>
                  <button @click="setStatusFilter('maintenance')" class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                    {{ $t('En maintenance') }}
                  </button>
                </li>
              </ul>
            </div>
            </div>
      </div>
    </div>

    <!-- Tableau des véhicules -->
    <!-- <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modèle</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacité</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière maintenance</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="vehicle in filteredVehicles" :key="vehicle.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ vehicle.registrationNumber }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vehicle.model }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vehicle.brand }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vehicle.year }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vehicle.capacity }} places</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusColor(vehicle.status)]">
                {{ getStatusText(vehicle.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new Date(vehicle.lastMaintenanceDate).toLocaleDateString() }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button @click="openEditModal(vehicle)" class="text-purple-600 hover:text-purple-900">
                  <Edit  />
                </button>
                <button @click="openDeleteModal(vehicle)" class="text-red-600 hover:text-red-900">
                  <Trash2  />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredVehicles.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
              Aucun véhicule trouvé.
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->
    <div class="bg-white overflow-hidden shadow-sm rounded-lg">
        <div v-if="loading" class="p-6 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-orange-500 border-gray-200"></div>
          <p class="mt-2 text-gray-500">{{ t('Chargement des vehicule...') }}</p>
        </div>

        <div v-else-if="filteredVehicles.length === 0" class="p-6 text-center">
          <p class="text-gray-500">{{ t('Aucun vehicule trouvé.') }}</p>
        </div>
        <div v-else>
        <TableOne
              :items="titles"
              :datas="datas"
              :options="filterOptions"
              :filterable="true"
              :pagination="true"

            />
        </div>
      </div>

    <!-- Modal d'ajout de véhicule -->

    <Modal v-if="isAddModalOpen" @close="isAddModalOpen = false">
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
        <h2 class="text-xl font-bold mb-4">Ajouter un nouveau véhicule</h2>
        <form @submit.prevent="addVehicle">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
              <input v-model="newVehicle.registrationNumber" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input v-model="newVehicle.model" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input v-model="newVehicle.brand" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Année</label>
              <input v-model.number="newVehicle.year" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Capacité (places)</label>
              <input v-model.number="newVehicle.capacity" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select v-model="newVehicle.status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="available">Disponible</option>
                <option value="in-use">En service</option>
                <option value="maintenance">En maintenance</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dernière maintenance</label>
              <input v-model="newVehicle.lastMaintenanceDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prochaine maintenance</label>
              <input v-model="newVehicle.nextMaintenanceDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="closeAddModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
      </template>
      </Modal>

    <!-- Modal de modification de véhicule -->
    <div v-if="isEditModalOpen && currentVehicle" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 class="text-xl font-bold mb-4">Modifier le véhicule</h2>
        <form @submit.prevent="saveEditedVehicle">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
              <input v-model="currentVehicle.registrationNumber" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input v-model="currentVehicle.model" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input v-model="currentVehicle.brand" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Année</label>
              <input v-model.number="currentVehicle.year" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Capacité (places)</label>
              <input v-model.number="currentVehicle.capacity" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select v-model="currentVehicle.status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="available">Disponible</option>
                <option value="in-use">En service</option>
                <option value="maintenance">En maintenance</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dernière maintenance</label>
              <input v-model="currentVehicle.lastMaintenanceDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prochaine maintenance</label>
              <input v-model="currentVehicle.nextMaintenanceDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="closeEditModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="isDeleteModalOpen && currentVehicle" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Confirmer la suppression</h2>
        <p class="mb-6">Êtes-vous sûr de vouloir supprimer le véhicule {{ currentVehicle.brand }} {{ currentVehicle.model }} ({{ currentVehicle.registrationNumber }}) ?</p>
        <div class="flex justify-end space-x-3">
          <button @click="closeDeleteModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Annuler
          </button>
          <button @click="deleteVehicle" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Supprimer
          </button>
        </div>
      </div>
    </div>

  </div>
</AdminLayout>
</template>
