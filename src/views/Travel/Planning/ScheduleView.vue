<script setup lang="ts">
import { ref,computed,onMounted,watch } from 'vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import TableOne from '@/components/tables/TableOne.vue';
import { useI18n } from 'vue-i18n';
import {PlusCircle } from 'lucide-vue-next';
import { Clock } from 'lucide-vue-next';
import Modal from '@/components/profile/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'



const { t } = useI18n();
const loading = ref(true);
const schedules = ref<any>([])
const searchQuery = ref('')
const modalOpen = ref(false)
const isEditMode = ref(false)
const isLoading = ref(false)
const formData = ref({
  startPoint: '',
  endPoint: '',
  departureTime: '',
  arrivalTime: '',
  estimatedDuration: '',
  frequency: '',
  operatingDays: '',
})

const frequencies = [
  { label: 'Quotidien', value: 'daily' },
  { label: 'Hebdomadaire', value: 'weekly' },
  { label: 'Mensuel', value: 'monthly' },
]

// ⏱ Calcul automatique de la durée
watch([() => formData.value.departureTime, () => formData.value.arrivalTime], ([start, end]) => {
  if (start && end) {
    const [h1, m1] = start.split(':').map(Number)
    const [h2, m2] = end.split(':').map(Number)

    let duration = (h2 * 60 + m2) - (h1 * 60 + m1)
    if (duration < 0) duration += 24 * 60

    formData.value.estimatedDuration = duration.toString()
  }
})

const submitForm = async () => {
  try {
    const payload = {
      route_name: `${formData.value.startPoint} - ${formData.value.endPoint}`,
      origin: formData.value.startPoint,
      destination: formData.value.endPoint,
      estimated_duration: Number(formData.value.estimatedDuration),
      status: formData.value.frequency,
      stops: [],
      created_by: 1, // remplace avec userId réel
      service_id: 3, // idem
    }
    console.log()

    // await createRoute(payload)
    // toast.success('Itinéraire enregistré avec succès !')
  } catch (error) {
    // toast.error('Erreur lors de l\'enregistrement.')
    console.error(error)
  }
}

const titles = computed(()=>([
      {
          name: 'trajet',
          label: t('trajet'),
          type: 'text',
          event: "view",
          filterable: true,
      },
      {
          name: 'heure',
          type: "text",
          label: t('heure'),
          filterable: false,
      },
      {
          name: 'frequence',
          type: "text",
          label: t('frequence'),
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
    schedules.value = [
    {
    trajet: 'Yaoundé - Douala',
    heure: '08:00',
    frequence: 'Quotidien',

  },
  {

    trajet: 'Douala - Bafoussam',
    heure: '08:00',
    frequence: 'Quotidien',
  },
    ];
    loading.value = false;
  }, 500);
});

const datas = computed(() =>
  filteredSchedules.value.map(s => ({
    trajet : s.trajet,
   heure:s.heure,
   frequence:s.frequence
  }))
);



const openAddModal = () => {
  modalOpen.value = true
  isEditMode.value = false
}

const closeAddModal = () => {
  modalOpen.value = false
  isEditMode.value = true
  formData.value = {
  startPoint: '',
  endPoint: '',
  departureTime: '',
  arrivalTime: '',
  estimatedDuration: '',
  frequency: '',
  operatingDays: '',
  }
}



// Filtrer les itinéraires en fonction de la recherche et des filtres
const filteredSchedules = computed(() => {
  return schedules.value.filter(s => {
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
          <Clock class="h-6 w-6 mr-2 text-orange-600" />
          {{ t('Tous les horaires') }}
        </h1>
        <button
          @click="openAddModal"
          class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <PlusCircle class="mr-2"/>
          {{ t('Ajouter une horaire') }}
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

        <div v-else-if="filteredSchedules.length === 0" class="p-6 text-center">
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

  <Modal v-if="modalOpen" @close="closeAddModal">
    <template #body>
      <div
        class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
        <!-- close btn -->
        <button
          @click="closeAddModal"
          class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
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
            {{ isEditMode ? $t('Edit') : $t('Add Schedule') }}
          </h4>
        </div>
        <form @submit.prevent="saveSchedule" class="flex flex-col">
          <div class="custom-scrollbar h-[400px] overflow-y-auto p-2">
            <div>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                  :lb="$t('Point de départ')"
                  v-model="formData.startPoint"
                />

                <Input
                  :lb="$t('Destination')"
                  v-model="formData.endPoint"
                />

                <Input
                  :lb="$t('Heure de départ')"
                  inputType="time"
                  v-model="formData.departureTime"
                />

                <Input
                  :lb="$t('Heure d\'arrivée')"
                  inputType="time"
                  v-model="formData.arrivalTime"
                />

                <Input
                  :lb="$t('Durée estimée (minutes)')"
                  :readonly="true"
                  v-model="formData.estimatedDuration"
                />

                <Select
                  :lb="$t('Fréquence')"
                  :options="frequencies"
                  v-model="formData.frequency"
                />
              </div>

                <div class="mt-5">
                <label
                  :for="'stops'"
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  {{ $t('Jours de fonctionnement') }} ({{ $t('SeparateWithComma') }})
                </label>
                <textarea
                  id="stops"
                   v-model="formData.operatingDays"
                  placeholder="Ex: Lundi, Mardi..."
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                ></textarea>
              </div>



            </div>
          </div>
          <div class="flex items-center gap-3 px-2 mt-2 lg:justify-end">
            <button
              @click="closeAddModal"
              type="button"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              {{ $t('Cancel') }}
            </button>
            <button
              type="submit"
              class="flex w-full justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 sm:w-auto"
            >
              <span v-if="!isLoading"> {{ isEditMode ? $t('Edit') : $t('Save') }}</span>
              <span v-else class="flex items-center gap-2">
                <Spinner class="w-4 h-4" />
                {{ $t('Processing') }}...
              </span>
            </button>
          </div>
        </form>
      </div>
    </template>
  </Modal>
</AdminLayout>
</template>

<style scoped></style>
