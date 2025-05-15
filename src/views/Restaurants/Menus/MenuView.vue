<script setup lang="ts">
    import { defineAsyncComponent, onBeforeMount, ref,computed } from 'vue'
    import TableOne from '@/components/tables/TableOne.vue';
    import AdminLayout from '@/components/layout/AdminLayout.vue';
    import { fetchMenu } from '@/services/database';
    import { useI18n } from 'vue-i18n';

    const NewMenuForm = defineAsyncComponent(() => import('./NewMenuForm.vue'));
    const {t} = useI18n()
    const pageTitle = ref('Menus');
    const titles = computed(()=>([
        {
            name: 'Title',
            label: t('Title'),
            type: 'url',
            event: "view",
            filterable: true,
        },
        {
            name: 'Description',
            type: "text",
            label: t('Description'),
            filterable: false,
        },
        {
            name: 'StartDate',
            type: "text",
            label: t('StartDate'),
            filterable: false,
        },
        {
            name: 'EndDate',
            type: "text",
            label: t('EndDate'),
            filterable: false,
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
    const isloading = ref(false);
    const menus = ref([]);
    const rawMenus = ref([]);

    const fetMenu = async () => {
        isloading.value = true;
        try {
            const result = await fetchMenu();
            // console.log('resultresult', result)
            const menuList = result.map((menu: any) => {
                return Object.fromEntries(Object.entries(menu).filter(([key]) => key !== "items"))
            });

            menus.value = menuList;
            rawMenus.value = result;
        } catch (er) {
            console.log('error', er);
        } finally {
            isloading.value = false
        }
    }
    const isViewing = ref(true)
    const selectedMenu = ref<any>();
    const viewMenu = (ts: any) => {
        isViewing.value = true;
        selectedMenu.value = rawMenus.value.filter((item:any) => item.Code == ts.Code)[0];
        console.log("selectedMenu", `/menus/${selectedMenu.value.Code}/view`)
        window.location.href = `/menus/${selectedMenu.value.Code}/view`
    }
    onBeforeMount(async () => {
        await fetMenu();
    });
    const cancel = (payload: any) => {
        isViewing.value = true;
        location.reload()

    }
    const handleAddMenu = (e:any) => {
        isViewing.value = false;

    }
</script>

<template>
    <div>
      <AdminLayout>
        <div class="flex flex-col gap-10 h-screen translate-y-24" v-if="isViewing">
            <TableOne :items="titles" :datas="menus" :options="filterOptions" @view="viewMenu" :filterable="true" :pagination="true">
                <template v-slot:headerButton>
                    <button @click="handleAddMenu" class="text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                        {{ $t('AddMenu') }}
                    </button>
                </template>
            </TableOne>
        </div>
        <template v-if="!isViewing">
            <new-menu-form @cancel="cancel" :action="'create'"></new-menu-form>
        </template>
      </AdminLayout>
    </div>
</template>
<!-- <template>
  <div class="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl">
    <h2 class="text-2xl font-semibold mb-4">Create Menu</h2>
    <form @submit.prevent="submitForm" class="space-y-4">

      <div>
        <label class="block text-sm font-medium text-gray-700">Menu Name</label>
        <input v-model="menu.name" type="text" required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
      </div>


      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea v-model="menu.description"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
      </div>


      <div>
        <label class="block text-sm font-medium text-gray-700">Price</label>
        <input v-model.number="menu.price" type="number" min="0" step="0.01" required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
      </div>


      <div>
        <label class="block text-sm font-medium text-gray-700">Service</label>
        <select v-model="menu.service_id" required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>
      </div>


      <div>
        <label class="block text-sm font-medium text-gray-700">Available Days</label>
        <div class="grid grid-cols-3 gap-2 mt-2">
          <label v-for="day in allDays" :key="day" class="inline-flex items-center space-x-2">
            <input type="checkbox" :value="day" v-model="menu.available_days"
              class="text-indigo-600 border-gray-300 rounded" />
            <span class="capitalize text-gray-700">{{ day }}</span>
          </label>
        </div>
      </div>

      <div class="flex items-center space-x-6">
        <label class="flex items-center space-x-2">
          <input type="checkbox" v-model="menu.is_takeaway_only"
            class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
          <span>Takeaway Only</span>
        </label>

        <label class="flex items-center space-x-2">
          <input type="checkbox" v-model="menu.is_reservation_required"
            class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
          <span>Reservation Required</span>
        </label>
      </div>


      <button type="submit"
        class="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition">
        Save Menu
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const menu = ref({
  name: '',
  description: '',
  price: 0,
  service_id: null,
  available_days: [],
  is_takeaway_only: false,
  is_reservation_required: false,
})

const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const services = ref([])

onMounted(async () => {

  services.value = [
    { id: 1, name: 'Main Restaurant' },
    { id: 2, name: 'Terrace' },
  ]
})

const submitForm = async () => {
  try {
    const response = await fetch('/api/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menu.value),
    })

    if (!response.ok) throw new Error('Failed to create menu')
    alert('Menu created successfully!')
  } catch (err) {
    alert('Error: ' + err.message)
  }
}
</script> -->
