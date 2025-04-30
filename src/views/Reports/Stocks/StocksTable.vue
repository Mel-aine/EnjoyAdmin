<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="$t('StockDashboard')" />
      <div class="py-5 mt-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ComponentCard title="Aperçu des stocks">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold">Niveau de stock global</h3>
              <select v-model="selectedLocation" class="border rounded-md px-3 py-2">
                <option value="all">Tous les emplacements</option>
                <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div v-for="(stat, index) in stockStats" :key="index" class="bg-gray-50 p-4 rounded-lg">
                <h4 class="text-gray-500 text-sm">{{ stat.label }}</h4>
                <div class="flex items-end mt-1">
                  <span class="text-2xl font-bold">{{ stat.value }}</span>
                  <span class="ml-2 text-sm" :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'">
                    {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <h4 class="text-sm font-medium mb-2">Produits à réapprovisionner</h4>
              <div class="space-y-2">
                <div
                  v-for="item in lowStockItems"
                  :key="item.product"
                  class="flex justify-between items-center border-b pb-2"
                >
                  <span>{{ item.product }}</span>
                  <div class="flex items-center">
                    <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        class="bg-red-500 h-2 rounded-full"
                        :style="`width: ${(item.quantity / item.threshold) * 100}%`"
                      ></div>
                    </div>
                    <span class="text-sm font-medium">{{ item.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Mouvements récents" class="col-span-2">
            <div class="mb-4 flex justify-between items-center">
              <h3 class="text-lg font-semibold">Dernières activités</h3>
              <router-link
                to="/stock-movements"
                class="text-blue-600 hover:text-blue-800"
              >
                Voir tout
              </router-link>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                    <th class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                    <th class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="movement in recentMovements" :key="movement.id" class="hover:bg-gray-50">
                    <td class="py-2 px-4 whitespace-nowrap">{{ movement.date }}</td>
                    <td class="py-2 px-4 whitespace-nowrap">{{ movement.product }}</td>
                    <td class="py-2 px-4 whitespace-nowrap">
                      <span
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"

                      >
                        {{ movement.type }}
                      </span>
                    </td>
                    <td class="py-2 px-4 whitespace-nowrap">{{ movement.quantity }}</td>
                    <td class="py-2 px-4 whitespace-nowrap">{{ movement.user }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ComponentCard>
        </div>

        <div class="grid grid-cols-1 gap-6">
          <ComponentCard title="Inventaire actuel">
            <div class="mb-4 flex justify-between items-center">
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="searchTerm"
                  placeholder="Rechercher un produit..."
                  class="border rounded-md px-3 py-2"
                />
                <select v-model="categoryFilter" class="border rounded-md px-3 py-2">
                  <option value="">Toutes catégories</option>
                  <!-- <option v-for="category in categories" :key="category" :value="category">{{ category }}</option> -->
                </select>
              </div>
              <button
                @click="printInventory"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Imprimer l'inventaire
              </button>
            </div>

            <ag-grid-vue
              class="ag-theme-quartz"
              :rowData="filteredInventory"
              :columnDefs="inventoryColumnDefs"
              :defaultColDef="defaultColDef"
              rowSelection="multiple"
              :pagination="true"
              :paginationPageSize="15"
              :domLayout="'autoHeight'"
              @gridReady="onGridReady"
            />
          </ComponentCard>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import { ref, computed, onMounted } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import type { GridReadyEvent, ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useToast } from 'vue-toastification'

interface StockMovement {
  id: number;
  date: string;
  product: string;
  type: string;
  quantity: number;
  source: string;
  destination: string;
  user: string;
  notes?: string;
}

interface InventoryItem {
  id: number;
  product: string;
  category: string;
  quantity: number;
  location: string;
  threshold: number;
  unitPrice: number;
  lastUpdated: string;
}

interface StockStat {
  label: string;
  value: number | string;
  trend: number;
}

// Services de toast pour les notifications
const { showSuccess, showError } = useToast();

// Filtres
const selectedLocation = ref('all');
const searchTerm = ref('');
const categoryFilter = ref('');

// Données mockées - à remplacer par des appels API réels
const recentMovements = ref<StockMovement[]>([
  {
    id: 1,
    date: "2025-04-27",
    product: "Savon",
    type: "Entrée",
    quantity: 100,
    source: "Fournisseur - UNILEVER",
    destination: "Entrepôt Central",
    user: "Admin",
    notes: "Livraison mensuelle"
  },
  {
    id: 2,
    date: "2025-04-28",
    product: "Shampoing",
    type: "Sortie",
    quantity: 30,
    source: "Entrepôt Central",
    destination: "Chambre 205",
    user: "Marie Dupont",
    notes: "Pour réapprovisionner les chambres"
  },
  {
    id: 3,
    date: "2025-04-29",
    product: "Serviettes",
    type: "Transfert",
    quantity: 50,
    source: "Entrepôt Central",
    destination: "Spa",
    user: "Thomas Martin",
    notes: "Demande du service spa"
  }
]);

const inventory = ref<InventoryItem[]>([
  {
    id: 1,
    product: "Savon",
    category: "Produits d'hygiène",
    quantity: 250,
    location: "Entrepôt Central",
    threshold: 100,
    unitPrice: 0.75,
    lastUpdated: "2025-04-27"
  },
  {
    id: 2,
    product: "Shampoing",
    category: "Produits d'hygiène",
    quantity: 180,
    location: "Entrepôt Central",
    threshold: 80,
    unitPrice: 1.25,
    lastUpdated: "2025-04-28"
  },
  {
    id: 3,
    product: "Serviettes",
    category: "Linge",
    quantity: 350,
    location: "Entrepôt Central",
    threshold: 150,
    unitPrice: 3.50,
    lastUpdated: "2025-04-29"
  },
  {
    id: 4,
    product: "Papier toilette",
    category: "Produits d'hygiène",
    quantity: 400,
    location: "Entrepôt Central",
    threshold: 200,
    unitPrice: 0.50,
    lastUpdated: "2025-04-26"
  },
  {
    id: 5,
    product: "Gel douche",
    category: "Produits d'hygiène",
    quantity: 210,
    location: "Entrepôt Central",
    threshold: 100,
    unitPrice: 1.75,
    lastUpdated: "2025-04-25"
  },
  {
    id: 6,
    product: "Eau minérale",
    category: "Minibar",
    quantity: 120,
    location: "Entrepôt Central",
    threshold: 80,
    unitPrice: 0.85,
    lastUpdated: "2025-04-24"
  },
  {
    id: 7,
    product: "Serviettes",
    category: "Linge",
    quantity: 45,
    location: "Spa",
    threshold: 30,
    unitPrice: 3.50,
    lastUpdated: "2025-04-29"
  },
  {
    id: 8,
    product: "Savon",
    category: "Produits d'hygiène",
    quantity: 15,
    location: "Spa",
    threshold: 20,
    unitPrice: 0.75,
    lastUpdated: "2025-04-25"
  }
]);

// Paramètres de la grille
const inventoryColumnDefs = ref<ColDef[]>([
  { headerName: "Produit", field: "product", filter: true },
  { headerName: "Catégorie", field: "category", filter: true },
  { headerName: "Quantité", field: "quantity", filter: true },
  { headerName: "Emplacement", field: "location", filter: true },
  {
    headerName: "Statut",
    field: "status",
    cellRenderer: ({ data }) => {
      const status = data.quantity <= data.threshold ? 'Faible' : 'Normal';
      const color = status === 'Faible' ? 'red' : 'green';
      return `<span class="text-${color}-600 font-semibold">${status}</span>`;
    }
  },
  { headerName: "Seuil d'alerte", field: "threshold", filter: true },
  {
    headerName: "Prix unitaire",
    field: "unitPrice",
    filter: true,
    valueFormatter: (params) => {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(params.value);
    }
  },
])
</script>
