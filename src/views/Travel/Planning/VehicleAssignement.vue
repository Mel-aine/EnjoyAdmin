<script setup lang="ts">
import { ref,computed,onMounted } from 'vue';
import { defineAsyncComponent } from 'vue'
const AdminLayout = defineAsyncComponent(() => import('@/components/layout/AdminLayout.vue'));
import TableOne from '@/components/tables/TableOne.vue';
import { useI18n } from 'vue-i18n';
import {PlusCircle } from 'lucide-vue-next';
import { CornerUpRight } from 'lucide-vue-next';



const { t } = useI18n();
const loading = ref(true);
const assignments = ref<any>([])
const searchQuery = ref('')

const titles = computed(()=>([
      {
          name: 'vehicle',
          label: t('vehicle'),
          type: 'text',
          event: "view",
          filterable: true,
      },
      {
          name: 'driver',
          type: "text",
          label: t('driver'),
          filterable: false,
      },
      {
          name: 'itineraire',
          type: "text",
          label: t('itineraire'),
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

  onMounted(async () => {
  // Simuler un appel API
  setTimeout(() => {
    assignments.value = [
    {
    itineraire: 'Yaoundé - Douala',
    driver: 'jean',
    vehicle: 'bus 101',

    },
    {

    itineraire: 'Yaoundé - Douala',
    driver: 'jean',
    vehicle: 'bus 101',

    },
    ];
    loading.value = false;
  }, 500);
});

const datas = computed(() =>
filteredVehicles.value.map((s:any) => ({
    trajet : s.trajet,
   heure:s.heure,
   frequence:s.frequence
  }))
);



// Filtrer les itinéraires en fonction de la recherche et des filtres
const filteredVehicles = computed(() => {
  return assignments.value.filter((s:any) => {
    // Filtre de recherche
    const matchesSearch =
      searchQuery.value === '' ||
        s.trajet.toLowerCase().includes(searchQuery.value.toLowerCase())



    return matchesSearch ;
  });
});

</script>

<template>
    <AdminLayout>
  <div class="p-6 h-screen">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-semibold text-gray-900 flex items-center">
          <CornerUpRight class="h-6 w-6 mr-2 text-orange-600" />
          {{ t('Assignment') }}
        </h1>
        <button

          class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <PlusCircle class="mr-2"/>
          {{ t('Ajouter un Conducteur') }}
        </button>
      </div>

      <!-- Filtres et recherche -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div class="relative">
            <input

              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              :placeholder="t('Rechercher ...')"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

    <div class="bg-white overflow-hidden shadow-sm rounded-lg">
        <div v-if="loading" class="p-6 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-orange-500 border-gray-200"></div>
          <p class="mt-2 text-gray-500">{{ t('Chargement...') }}</p>
        </div>

        <div v-else-if="filteredVehicles.length === 0" class="p-6 text-center">
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
</template>

<style scoped></style>
