
<script setup lang="ts">
import { ref, onMounted,computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {PlusCircle } from 'lucide-vue-next';
import { Route as RouteIcon } from 'lucide-vue-next';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import TableOne from '@/components/tables/TableOne.vue'
import Modal from '@/components/profile/Modal.vue';
import Input from '@/components/forms/FormElements/Input.vue';
import Select from '@/components/forms/FormElements/Select.vue';


interface Route {
  id: number;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: number;
  duration: string;
  stops: number;
  status: 'active' | 'inactive' | 'maintenance';
}

const { t } = useI18n();
const routes = ref<Route[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const ORANGE = 'bg-orange-300 rounded';
const BLUE = 'bg-blue-300 rounded';
const GREEN = 'bg-green-300 rounded';
const statusFilter = ref('all');
const isStatusDropdownOpen = ref(false);
const modalOpen = ref(false)

const toggleStatusDropdown = () => {
  isStatusDropdownOpen.value = !isStatusDropdownOpen.value;
};

const setStatusFilter = (status:any) => {
  statusFilter.value = status;
  isStatusDropdownOpen.value = false;
};


const titles = computed(()=>([
      {
          name: 'name',
          label: t('name'),
          type: 'url',
          event: "view",
          filterable: true,
      },
      {
          name: 'trajet',
          type: "text",
          label: t('trajet'),
          filterable: false,
      },
      {
          name: 'distance',
          type: "text",
          label: t('distance'),
          filterable: false,
      },
      {
          name: 'duration',
          type: "text",
          label: t('duration'),
          filterable: false,
      },
      {
          name: 'stops',
          type: "text",
          label: t('arret'),
          filterable: false,
      },
      {
        name: 'status',
        label: t('Statut'),
        type: 'badge',
        filterable: true,
      },
      {
          name: 'Actions',
          type: 'action',
          label: t('Actions'),
          colored: true,
          actions: [
              {
                  name: "view",
                  icone:
                  `
                   <svg class="h-6 w-6 text-slate-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="2" />  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />  <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>
                  `
                  ,
                  event: 'view',
                  color: ORANGE,
              },
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
                color: GREEN,
              },
              {
                  name: "delete",
                  icone: `
                  <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  `,
                  event: 'delete',
                  color: BLUE,
              }

          ]
      }
  ]));


// Récupérer les données des itinéraires (simulation)
onMounted(async () => {
  // Simuler un appel API
  setTimeout(() => {
    routes.value = [
    {
    id: 1,
    name: 'Yaoundé - Douala',
    startPoint: 'Yaoundé',
    endPoint: 'Douala',
    distance: 230,
    duration: '3h30',
    stops: 2,
    status: 'active'
  },
  {
    id: 2,
    name: 'Douala - Bafoussam',
    startPoint: 'Douala',
    endPoint: 'Bafoussam',
    distance: 210,
    duration: '4h00',
    stops: 2,
    status: 'active'
  },
  {
    id: 3,
    name: 'Yaoundé - Bafoussam',
    startPoint: 'Yaoundé',
    endPoint: 'Bafoussam',
    distance: 290,
    duration: '5h00',
    stops: 2,
    status: 'maintenance'
  },
  {
    id: 4,
    name: 'Douala - Limbe',
    startPoint: 'Douala',
    endPoint: 'Limbe',
    distance: 75,
    duration: '1h45',
    stops: 1,
    status: 'active'
  },
  {
    id: 5,
    name: 'Garoua - Maroua',
    startPoint: 'Garoua',
    endPoint: 'Maroua',
    distance: 270,
    duration: '5h30',
    stops: 2,
    status: 'inactive'
  }
    ];
    loading.value = false;
  }, 500);
});

const datas = computed(() =>
  filteredRoutes.value.map(route => ({
    id: route.id,
    name: route.name,
    trajet: `${route.startPoint} → ${route.endPoint}`,
    distance: `${route.distance} km`,
    duration: route.duration,
    stops: route.stops,
    status: getStatusBadge(route.status)
  }))
);



// Filtrer les itinéraires en fonction de la recherche et des filtres
const filteredRoutes = computed(() => {
  return routes.value.filter(route => {
    // Filtre de recherche
    const matchesSearch =
      searchQuery.value === '' ||
      route.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      route.startPoint.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      route.endPoint.toLowerCase().includes(searchQuery.value.toLowerCase());

    // Filtre par statut
    const matchesStatus =
      statusFilter.value === 'all' ||
      route.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

// Déterminer la couleur du badge en fonction du statut
const getStatusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    active: {
      label: 'Actif',
      bg: 'bg-green-100',
      text: 'text-green-800'
    },
    inactive: {
      label: 'Inactif',
      bg: 'bg-gray-100',
      text: 'text-gray-800'
    },
    maintenance: {
      label: 'Maintenance',
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


// Fonction pour afficher les détails d'un itinéraire
const viewRouteDetails = (routeId: number) => {
  // Implémentation de la navigation vers les détails
  console.log(`Afficher les détails de l'itinéraire ${routeId}`);
};

// Fonction pour modifier un itinéraire
const editRoute = (routeId: number) => {
  // Implémentation de la navigation vers l'édition
  console.log(`Modifier l'itinéraire ${routeId}`);
};

// Fonction pour supprimer un itinéraire
const deleteRoute = (routeId: number) => {
  if (confirm(t('Êtes-vous sûr de vouloir supprimer cet itinéraire ?'))) {
    routes.value = routes.value.filter(route => route.id !== routeId);
    console.log(`Itinéraire ${routeId} supprimé`);
  }
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

</script>

<template>
  <AdminLayout>
    <div class="p-6 min-h-screen">
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-semibold text-gray-900 flex items-center">
          <RouteIcon class="h-6 w-6 mr-2 text-orange-600" />
          {{ t('Tous les itinéraires') }}
        </h1>
        <button
          @click="modalOpen=true"
          class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg> -->
          <PlusCircle class="mr-2"/>
          {{ t('Ajouter un itinéraire') }}
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
              :placeholder="t('Rechercher un itinéraire...')"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <div class="flex space-x-2">
            <!-- <select
              v-model="statusFilter"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option value="all">{{ t('Tous les statuts') }}</option>
              <option value="active">{{ t('Actifs') }}</option>
              <option value="inactive">{{ t('Inactifs') }}</option>
              <option value="maintenance">{{ t('En maintenance') }}</option>
            </select> -->
            <div class="relative">
              <button
                class="border border-purple-500 bg-white rounded-lg text-purple-500 px-4 py-2 flex items-center gap-2"
                @click="toggleStatusDropdown"
              >
                <span>
                  {{ $t(
                    statusFilter === 'all' ? 'Tous les statuts'
                    : statusFilter === 'active' ? 'Actifs'
                    : statusFilter === 'inactive' ? 'Inactifs'
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
                  <button @click="setStatusFilter('active')" class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                    {{ $t('Actifs') }}
                  </button>
                </li>
                <li>
                  <button @click="setStatusFilter('inactive')" class="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                    {{ $t('Inactifs') }}
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
      </div>

      <!-- Tableau des itinéraires -->
      <div class="bg-white overflow-hidden shadow-sm rounded-lg">
        <div v-if="loading" class="p-6 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-orange-500 border-gray-200"></div>
          <p class="mt-2 text-gray-500">{{ t('Chargement des itinéraires...') }}</p>
        </div>

        <div v-else-if="filteredRoutes.length === 0" class="p-6 text-center">
          <p class="text-gray-500">{{ t('Aucun itinéraire trouvé.') }}</p>
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
    </div>
  </AdminLayout>
  <Modal v-if="modalOpen" @close="modalOpen = false">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <!-- close btn -->
          <button
            @click="modalOpen = false"
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
              {{ $t('Add Itinerary') }}
            </h4>

          </div>
          <form class="flex flex-col">
            <div class="custom-scrollbar h-[400px] overflow-y-auto p-2">
              <div>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Input :lb="$t('Name')"  :placeholder="$t('Name')"  :id="'name'" :forLabel="'name'" />
                  </div>

                  <div>
                    <Input :lb="$t('trajet')"  :placeholder="$t('trajet')" :id="'last'" :forLabel="'last'" />
                  </div>

                  <div>
                    <Input :lb="$t('distance')"  :placeholder="$t('distance')" :id="'code'" :forLabel="'code'" />
                  </div>
                  <div>
                    <Input :lb="$t('duration')" :inputType = "'time'"  :placeholder="$t('duration')" :id="'duree'" :forLabel="'duree'" />
                  </div>
                  <div>
                    <Input :lb="$t('arret')" :inputType = "'number'"  :placeholder="$t('arret')" :id="'stop'" :forLabel="'stop'" :min="'1'" />
                  </div>
                  <div>
                    <Select :lb="$t('status')"  />
                  </div>
                </div>
              </div>

            </div>
            <div class="flex items-center gap-3 px-2 mt-2 lg:justify-end">
              <button
                @click="modalOpen = false"
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
