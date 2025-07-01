
<template>
  <AdminLayout>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex items-center justify-start mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield class="w-6 h-6 text-blue-600" />
              Gestion des Permissions
            </h1>
            <p class="text-gray-600 mt-1">Configurez les rôles et les permissions pour les utilisateurs de l'application</p>
          </div>

        </div>

        <!-- Search -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Rechercher un rôle..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen">
        <!-- Roles List -->
        <div class="lg:col-span-1 lg:sticky lg:top-20 self-start h-fit">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex justify-between py-2">
            <h2 class="font-semibold text-gray-900 mb-4">Rôles ({{ filteredRoles.length }})</h2>
            <button @click="showModal" class="rounded-full bg-orange-50 p-2 ">
            <Plus class="text-orange-500"/>
            </button>
            </div>
            <div class="space-y-2 max-h-96 overflow-y-auto">
              <button
                v-for="role in filteredRoles"
                :key="role"
                @click="selectedRole = role"
                :class="selectedRole === role
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                "
                class="w-full text-left p-3 rounded-lg border transition-colors"
              >
                <div class="font-medium">{{ role }}</div>
                <div class="text-sm text-gray-500 mt-1">{{ getPermissionCount(roles[role]) }} permissions</div>
              </button>
            </div>
          </div>
        </div>

        <!-- Permissions Details -->
        <div class="lg:col-span-3">

          <div v-if="selectedRole" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-xl font-semibold text-gray-900">{{ selectedRole }}</h2>
                <p class="text-gray-600">{{ getPermissionCount(roles[selectedRole]) }} permissions attribuées</p>
              </div>
            </div>

            <div v-if="Object.keys(getPermissionsByCategory(roles[selectedRole])).length">
              <div
                v-for="(permissions, category) in getPermissionsByCategory(roles[selectedRole])"
                :key="category"
                class="border border-gray-200 rounded-lg p-4 mb-6"
              >
                <h3
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-3"
                  :class="getCategoryColor(category)"
                >
                  {{ category }}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="permission in permissions"
                    :key="permission"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div class="flex items-center gap-3">
                      <component
                          :is="iconComponent(permissionLabels[permission]?.icon)"
                          class="w-4 h-4"
                        />

                      <span class="text-gray-700">{{ permissionLabels[permission]?.label || permission }}</span>

                    </div>
                    <div class="w-5 h-5 bg-green-100 border-2 border-green-500 rounded flex items-center justify-center">
                      <div class="w-2 h-2 bg-green-500 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <div v-else class="text-center py-12">
              <Shield class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500">Aucune permission attribuée à ce rôle</p>
            </div>

            <div class="flex justify-end gap-3">
            <button
              @click="toggleEditMode"
              :class="editMode
                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
              "
              class="px-4 py-2 rounded-lg border transition-colors"
            >
              {{ editMode ? 'Annuler' : 'Modifier' }}
            </button>
            <button
              v-if="editMode"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Sauvegarder
            </button>
          </div>

            <div v-if="editMode" class="mt-8 pt-6 border-t border-gray-200">
              <h4 class="font-medium text-gray-900 mb-4">Modifier les permissions</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <label
                  v-for="permission in allPermissions"
                  :key="permission"
                  class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    v-model="roles[selectedRole][permission]"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div class="flex items-center gap-2">
                    <!-- <component :is="icons[permission]?.icon" class="w-4 h-4" /> -->
                     <component
                          :is="iconComponent(permissionLabels[permission]?.icon)"
                          class="w-4 h-4"
                        />

                      <span class="text-gray-700">{{ permissionLabels[permission]?.label || permission }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Users class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Sélectionnez un rôle</h3>
            <p class="text-gray-600">Choisissez un rôle dans la liste pour voir ses permissions</p>
          </div>
        </div>
      </div>

      <!-- les toasts -->
         <!-- <div v-if="showToast"
             class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300">
            <i class="fas fa-check-circle mr-2"></i>
            {{ toastMessage }}
        </div> -->
    </div>
  </div>

   <Modal v-if="modalOpen" @close="closeModal()">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >

          <button
            @click="closeModal()"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
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
              role
            </h4>
          </div>
          <form  class="flex flex-col">
            <div class="h-[300px]  p-2">
              <div class="space-y-8">

                <div>
                  <div class="space-y-6">
                    <Input
                      :lb="$t('Name')"
                      :id="'name'"
                      :forLabel="'name'"
                    />
                     <div>
                      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Description
                      </label>
                      <textarea
                        placeholder="Enter a description..."
                        rows="6"
                        class="dark:bg-dark-900 h-40 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                      ></textarea>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">

              <button
                @click="closeModal()"
                type="button"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                :disabled="isLoading"
              >
                {{ $t('Cancel') }}
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="relative flex w-full justify-center items-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 transition disabled:opacity-50 sm:w-auto"
              >
                <span v-if="!isLoading"> {{ $t('Save') }}</span>
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

<script lang="ts" setup>
import AdminLayout from '@/components/layout/AdminLayout.vue';
import Modal from '@/components/profile/Modal.vue';
import Input from '@/components/forms/FormElements/Input.vue';
import { ref, computed,watchEffect, onMounted } from 'vue';
import {getPermission} from '@/services/api'
import * as icons from 'lucide-vue-next'

import {Shield} from 'lucide-vue-next';
import {Search} from 'lucide-vue-next';
import {Users} from 'lucide-vue-next';
import {Plus} from 'lucide-vue-next';
import type { Component } from 'vue'




type Role = Record<string, boolean>;
type Roles = Record<string, Role>;
const searchTerm = ref('');
const selectedRole = ref<string | null>(null);
const editMode = ref(false);
const modalOpen = ref(false)
const isLoading = ref(false)
const closeModal = () => {
  modalOpen.value = false
}
const showModal = () => {
  modalOpen.value = true
}

const initialRoles: Roles = {
  "Directeur d'hôtel": {
    "bookings_read": true,
    "inventory_update": true,
    "bookings_create": true,
    "room_service_request": true,//Gérer les demandes de service en chambre
    "menu_manage": true,//(Gérer les menus de restauration)
    "maintenance_request_create": true,// Créer une demande de maintenance
    "rooms_create": true,
    "reports_export": true,
    "users_update": true,
    "rooms_delete": true,
    "maintenance_request_manage": true,//Gérer les interventions
    "inventory_read": true, //Lire l’inventaire (fournitures, produits, linge, etc.)
    "users_create": true,
    "budget_view": true,//Consulter les budgets
    "users_read": true,
    "rooms_read": true,
    "reports_view": true,
    "rooms_update": true,
    "settings_manage": true,
    "budget_edit": true,
    "users_delete": true,
    "bookings_update": true,
    "bookings_delete": true,
    "promotions_manage": true,//Créer ou modifier des offres commerciales
    "billing_manage": true,//Gérer les factures et paiements
    "menu_view": true
  },
  "Directeur de l'hébergement": {
    "users_read": true,
    "users_update": true,
    "rooms_create": true,
    "rooms_read": true,
    "rooms_update": true,
    "bookings_create": true,
    "bookings_read": true,
    "bookings_update": true,
    "bookings_delete": true,
    "reports_view": true,
    "inventory_read": true,
    "maintenance_request_manage": true
  },
  "Chef-réceptionniste": {
    "users_read": true,
    "rooms_read": true,
    "bookings_create": true,
    "bookings_read": true,
    "bookings_update": true,
    "inventory_read": true
  },
  "Réceptionniste": {
    "rooms_read": true,
    "bookings_create": true,
    "bookings_read": true,
    "bookings_update": true
  },
  "Concierge": {
    "bookings_read": true
  },
  "Veilleur de nuit": {
    "bookings_create": true,
    "bookings_read": true,
    "bookings_update": true,
    "rooms_read": true
  },
  "Portier": {
    "rooms_read": true,
    "bookings_read": true
  },
  "Chef de cuisine": {
    "menu_manage": true,
    "inventory_read": true,
    "inventory_update": true
  },
  "Responsable de salle": {
    "users_read": true
  },
  "Maître d'hôtel": {},
  "Serveur": {},
  "Barman": {},
  "Chef de partie": {},
  "Commis de cuisine": {},
  "Plongeur": {},
  "Employé d'étage": {
    "rooms_read": true
  },
  "Gouvernante": {
    "rooms_read": true,
    "inventory_read": true,
    "maintenance_request_create": true
  },
  "Responsable de l'entretien ménager": {
    "rooms_read": true,
    "inventory_read": true,
    "maintenance_request_manage": true
  },
  "Employé de maintenance": {
    "rooms_read": true,
    "maintenance_request_manage": true
  },
  "Responsable des réservations": {
    "bookings_create": true,
    "bookings_read": true,
    "bookings_update": true,
    "bookings_delete": true
  },
  "Service de chambre": {
    "room_service_request": true,
    "rooms_read": true
  },
  "Responsable marketing et ventes": {
    "promotions_manage": true,
    "reports_view": true,
    "reports_export": true
  },
  "Directeur des opérations": {
    "users_read": true,
    "rooms_read": true,
    "bookings_read": true,
    "reports_view": true,
    "reports_export": true,
    "settings_manage": true
  },
  "Directeur financier": {
    "billing_manage": true,
    "budget_view": true,
    "budget_edit": true,
    "reports_view": true,
    "reports_export": true
  }
};
const roles = ref<Roles>({ ...initialRoles });




const filteredRoles = computed(() =>
  Object.keys(roles.value).filter(r => r.toLowerCase().includes(searchTerm.value.toLowerCase()))
);

const allPermissions = computed(() =>
  Array.from(
    new Set(Object.values(roles.value).flatMap(r => Object.keys(r)))
  ).sort()
);
console.log ("allPermissions",allPermissions.value)

function toggleEditMode() {
  editMode.value = !editMode.value;
}

function getPermissionCount(r: Role): number {
  return Object.values(r).filter(Boolean).length;
}

function getPermissionsByCategory(r: Role): Record<string, string[]> {
  const cats: Record<string, string[]> = {};
  for (const p in r) {
    if (r[p]) {
      const cat = permissionLabels.value[p]?.category || 'Autres';
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(p);
    }
  }
  return cats;
}

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    Réservations: 'bg-blue-100 text-blue-800 border-blue-200',
    Chambres: 'bg-green-100 text-green-800 border-green-200',
    Utilisateurs: 'bg-purple-100 text-purple-800 border-purple-200',
    Inventaire: 'bg-orange-100 text-orange-800 border-orange-200',
    Rapports: 'bg-gray-100 text-gray-800 border-gray-200',
    Finance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Maintenance: 'bg-red-100 text-red-800 border-red-200',
    Services: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Restauration: 'bg-pink-100 text-pink-800 border-pink-200',
    Marketing: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Administration: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };
  return map[category] || 'bg-gray-100 text-gray-800 border-gray-200';
}

type Permission = {
  id: string
  name: string
  label: string
  category: string
  icon: string
  createdAt: string
  updatedAt: string
}



const permissionLabels = ref<Record<string, Permission>>({});


const fetchPermissions = async () => {
  try {
    const response = await getPermission();
    const permissionsArray: Permission[] = response.data.data;


    permissionLabels.value = Object.fromEntries(
      permissionsArray.map(p => [p.name, p])
    );
    console.log("permissionLabels.value",permissionLabels.value)
  } catch (error) {
    console.error('Erreur lors du chargement des permissions', error);
  }
};


onMounted(()=>{
  fetchPermissions()

})



const iconComponent = (name?: string): Component => {
  const pascalName = toPascalCase(name || '')
  const icon = icons[pascalName as keyof typeof icons]

  if (typeof icon === 'function' || (icon && typeof icon === 'object')) {
    return icon as Component
  }

  return icons.CircleHelp as Component
}


function toPascalCase(str: string) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
}


</script>

<style scoped>
/* Optional: add custom scrollbars or layout tweaks */
</style>

