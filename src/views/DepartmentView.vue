<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="flex justify-end pb-5">
        <!-- Bouton qui ouvre/ferme le dropdown -->
        <button
          class="border border-gray-300 bg-purple-400 rounded-lg relative"
          @click="toggleDropdown"
        >
          <svg class="h-8 w-8 text-white" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div v-if="isDropdownOpen" class="z-10 mt-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 absolute">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <button class="block px-4 py-2 hover:text-purple-600 dark:hover:text-white" >Ajouter un département</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Modal pour ajouter un département -->
      <div v-if="isAddModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96">
          <h2 class="text-xl font-semibold mb-4">Ajouter un département</h2>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom du département</label>
            <input
              type="text"
              v-model="newDepartment.name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ex: Restauration, Entretien, etc."
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="newDepartment.description"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Description du département"
              rows="3"
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
            <input
              type="text"
              v-model="newDepartment.manager"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nom du responsable"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre d'employés</label>
            <input
              type="number"
              v-model="newDepartment.employeeCount"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="0"
            />
          </div>
          <div class="flex justify-end space-x-3">
            <button
              @click="closeAddDepartmentModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              @click="addDepartment"
              class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-5 pt-10 sm:space-y-6">
        <ag-grid-vue
          class="ag-theme-quartz"
          :rowData="departmentsData"
          :columnDefs="columnDefs"
          rowHeight="50"
          :rowSelection="'single'"
          :domLayout="'autoHeight'"
          :pagination="true"
          @cellClicked="onCellClick"
          @gridReady="onGridReady"
          :autoSizeStrategy="autoSizeStrategy"
          @selectionChanged="getSelectedRows"
          :defaultColDef="defaultColDef">
        </ag-grid-vue>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { ref } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';

const currentPageTitle = ref("Départements");
const isDropdownOpen = ref(false);
const isAddModalOpen = ref(false);

const newDepartment = ref({
  id: '',
  name: '',
  description: '',
  manager: '',
  employeeCount: 0,
  budget: '',
  status: 'Actif'
});

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const openAddDepartmentModal = () => {
  isAddModalOpen.value = true;
  isDropdownOpen.value = false;
};

const closeAddDepartmentModal = () => {
  isAddModalOpen.value = false;
  // Réinitialiser le formulaire
  newDepartment.value = {
    id: '',
    name: '',
    description: '',
    manager: '',
    employeeCount: 0,
    budget: '',
    status: 'Actif'
  };
};

const addDepartment = () => {
  // Générer un ID unique
  newDepartment.value.id = '#' + Math.floor(Math.random() * 900000 + 100000);
  // Ajouter un budget fictif
  newDepartment.value.budget = Math.floor(Math.random() * 500000 + 100000) + ' FCFA';

  // Ajouter le département à la liste
  departmentsData.value.unshift({ ...newDepartment.value });

  // Fermer le modal et réinitialiser
  closeAddDepartmentModal();

  // Notification de succès (à implémenter selon votre système)
  alert('Département ajouté avec succès!');
};

const defaultColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};

const columnDefs = ref<ColDef[]>([
  {
    headerName: 'ID',
    field: 'id',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    width: 110
  },
  {
    headerName: 'Nom du département',
    field: 'name',
    flex: 2
  },
  {
    headerName: 'Description',
    field: 'description',
    flex: 3
  },
  {
    headerName: 'Responsable',
    field: 'manager',
    flex: 2
  },
  {
    headerName: 'Employés',
    field: 'employeeCount',
    width: 120
  },
  {
    headerName: 'Budget',
    field: 'budget',
    width: 150
  },
  {
    headerName: 'Statut',
    field: 'status',
    width: 120,
    cellRenderer: (params: any) => {
      const status = params.value;
      let bgColor = 'bg-green-100 text-green-800';

      if (status === 'Inactif') {
        bgColor = 'bg-red-100 text-red-800';
      } else if (status === 'En révision') {
        bgColor = 'bg-yellow-100 text-yellow-800';
      }

      return `<span class="px-2 py-1 text-xs font-semibold rounded-full ${bgColor}">${status}</span>`;
    }
  },
  {
    headerName: 'Actions',
    cellRenderer: () => `
      <div class="flex space-x-2">
        <button class="p-1" data-action="edit">
          <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
            <line x1="16" y1="5" x2="19" y2="8" />
          </svg>
        </button>
        <button class="p-1" data-action="delete">
          <svg class="h-5 w-5 text-red-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
        </button>
        <button class="p-1" data-action="view">
          <svg class="h-5 w-5 text-slate-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <circle cx="12" cy="12" r="2" />
            <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />
            <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
          </svg>
        </button>
      </div>
    `,
    width: 130
  },
]);

const onGridReady = (event: GridReadyEvent) => {
  console.log('Grid ready:', event);
};

const onCellClick = (event: any) => {
  console.log('Cell clicked:', event.data);
  const button = event.event.target.closest('button');
  console.log('Button clicked:', button);

  // Gestion des actions (édition, suppression, affichage)
  if (event.colDef.headerName === 'Actions') {
    // const action = (event.event as MouseEvent).target?.closest('button')?.getAttribute('data-action');
    if (!button) {
    console.error('No button found');
    return;
  }

  const action = button.dataset.action;

    if (action === 'edit') {
      // alert(`Éditer le département: ${event.data.name}`);
      // Implémenter la logique d'édition
    } else if (action === 'delete') {
      // if (confirm(`Êtes-vous sûr de vouloir supprimer le département: ${event.data.name}?`)) {
      //   // Logique de suppression
      //   departmentsData.value = departmentsData.value.filter((dept:any) => dept.id !== event.data.id);
      // }
    } else if (action === 'view') {
      //alert(`Afficher les détails du département: ${event.data.name}`);
      // Implémenter la logique d'affichage détaillé
    }
  }
};

const getSelectedRows = (event: SelectionChangedEvent) => {
  const selected = event.api.getSelectedRows();
  console.log('Selected rows:', selected);
};

const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
};

// Données des départements
const departmentsData = ref([
  {
    id: "#D10001",
    name: "Restauration",
    description: "Gestion des restaurants et des services de repas",
    manager: "Marie Dupont",
    employeeCount: 25,
    budget: "350000 FCFA",
    status: "Actif"
  },
  {
    id: "#D10002",
    name: "Housekeeping",
    description: "Entretien des chambres et des espaces communs",
    manager: "Jean Kouamé",
    employeeCount: 30,
    budget: "280000 FCFA",
    status: "Actif"
  },
  {
    id: "#D10003",
    name: "Réception",
    description: "Accueil des clients et gestion des réservations",
    manager: "Sophie Traoré",
    employeeCount: 12,
    budget: "220000 FCFA",
    status: "Actif"
  },
  {
    id: "#D10004",
    name: "Maintenance",
    description: "Entretien technique et réparations",
    manager: "Pierre Koné",
    employeeCount: 8,
    budget: "180000 FCFA",
    status: "Actif"
  },
  {
    id: "#D10005",
    name: "Spa & Bien-être",
    description: "Services de spa, massage et soins",
    manager: "Amina Diallo",
    employeeCount: 10,
    budget: "250000 FCFA",
    status: "Actif"
  },
  {
    id: "#D10006",
    name: "Événementiel",
    description: "Organisation de conférences et événements",
    manager: "Ibrahim Touré",
    employeeCount: 6,
    budget: "300000 FCFA",
    status: "En révision"
  },
  {
    id: "#D10007",
    name: "Comptabilité",
    description: "Gestion financière et comptable",
    manager: "Fatou Sanogo",
    employeeCount: 5,
    budget: "180000 FCFA",
    status: "Actif"
  },
  {
    id: "#D10008",
    name: "Sécurité",
    description: "Surveillance et sécurité de l'établissement",
    manager: "Moussa Camara",
    employeeCount: 12,
    budget: "220000 FCFA",
    status: "Actif"
  },
  {
    id: "#D10009",
    name: "Marketing",
    description: "Promotion et communication de l'hôtel",
    manager: "Aya Konaté",
    employeeCount: 4,
    budget: "280000 FCFA",
    status: "Actif"
  },
]);
</script>

<style scoped>
/* Vous pouvez ajouter des styles spécifiques ici si nécessaire */
</style>
