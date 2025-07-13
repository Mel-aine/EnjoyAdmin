<template>
  <AdminLayout>
    <FullScreenLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="space-y-5 sm:space-y-6  ">
          <div class="flex justify-end ">
            <!-- Bouton qui ouvre/ferme le dropdown -->
            <button
            class="border border-gray-300 bg-purple-400 rounded-lg relative"
            @click="toggleDropdown"
            >
            <svg class="h-8 w-8 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z"/>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <div v-if="isDropdownOpen" class="z-10 mt-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 absolute">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <a href="/add_booking" class="block px-4 py-2  hover:text-purple-600 dark:hover:text-white">{{$t('AddBooking')}} </a>
              </li>
            </ul>
          </div>
          </div>
          <AllBooking/>
      </div>
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref,computed,onMounted } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
// import ComponentCard from "@/components/common/ComponentCard.vue";
import AllBooking from "@/components/tables/booking-tables/AllBookingTable.vue";
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const currentPageTitle = computed(()=>t("BookingLists"));


const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
</script>
