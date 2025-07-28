<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="$t('Department')" />

      <!-- Modal pour ajouter un département -->
      <Modal v-if="isAddModalOpen" @close="isAddModalOpen = false">
        <template #body>
          <div
            class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <button @click="closeAddDepartmentModal"
              class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
              <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                  fill="" />
              </svg>
            </button>
            <h2 class="text-lg font-semibold mb-4">{{ isEditing ? $t('edit') : $t('add') }}</h2>
            <form @submit.prevent="onAddDepartment">
              <div class="mb-4">
                <Input :lb="$t('Name')" v-model="newDepartment.name" />
              </div>
              <div class="mb-4">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('Description')
                }}</label>
                <textarea v-model="newDepartment.description"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-900 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  rows="3"></textarea>
              </div>
              <div class="mb-4">
                <Select :lb="$t('manager')" v-model="newDepartment.manager" :options="Users" />
              </div>
              <div class="mb-4">
                <Input :lb="$t('numberEmployee')" :inputType="'number'" v-model="newDepartment.employeeCount" min="0" />
              </div>
              <div class="flex justify-end space-x-3">
                <button @click="closeAddDepartmentModal"
                  class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                  {{ $t('Cancel') }}
                </button>
                <button type="submit" class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
                  <span v-if="!isLoading"> {{ isEditing ? $t('update') : $t('Save') }}</span>
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
      <Modal v-if="showModal" @close="showModal = false">
        <template #body>
          <div
            class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <button @click="showModal = false"
              class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
              <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                  fill="" />
              </svg>
            </button>

            <h2 class="text-lg font-semibold mb-6">{{ $t('departmentDetails') }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-white/80">
              <div class="flex flex-col">
                <span class="text-purple-500 dark:text-gray-400 font-medium">{{ $t('departmentName') }}</span>
                <span class="mt-1">{{ selectedDepartment?.name || '-' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-purple-500 dark:text-gray-400 font-medium">{{ $t('manager') }}</span>
                <span class="mt-1">{{ selectedDepartment?.responsible || '-' }}</span>
              </div>
              <div class="flex flex-col sm:col-span-2">
                <span class="text-purple-500 dark:text-gray-400 font-medium">{{ $t('Description') }}</span>
                <span class="mt-1">{{ selectedDepartment?.description || '-' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-purple-500 dark:text-gray-400 font-medium">{{ $t('numberEmployee') }}</span>
                <span class="mt-1">{{ selectedDepartment?.numberEmployees ?? 0 }}</span>
              </div>
            </div>

          </div>
        </template>
      </Modal>

      <div class="space-y-5 sm:space-y-6 min-h-screen">

        <TableComponent :items="titles" :datas="departmentsData" :filterable="true" :pagination="true"
          :searchable="false" :loading="loading" :showHeader="true" :title="$t('Department')" :pageSize="15"
          :showButtonAllElement="true" @edit="onEditDept" @delete="onDeleteDept" class="modern-table" @view="onView">
          <template v-slot:headerActions>
            <div class="flex justify-end  gap-2">

              <button @click="openAddDepartmentModal()"
                class="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {{ $t('add') }}
              </button>

              <button @click="importDepartment()"
                class="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition flex items-center">

                {{ $t('importdefault') }}
              </button>
            </div>

          </template>
        </TableComponent>

      </div>
    </AdminLayout>
  </div>
  <ModalDelete v-if="show" @close="show = false" @delete="confirmDelete" :isLoading="loadingDelete" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted, watch, computed } from 'vue';
import { createDepartment, getDepartment, updateDpt, deleteDpt, getUser, getUserByServiceId } from "@/services/api";
import { useServiceStore } from '@/composables/serviceStore';
import TableComponent from '@/components/tables/TableComponent.vue'
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';
import { departments } from '@/assets/data/department';
import router from '@/router';
import { json } from 'stream/consumers';



const PageBreadcrumb = defineAsyncComponent(() => import('@/components/common/PageBreadcrumb.vue'));
const AdminLayout = defineAsyncComponent(() => import('@/components/layout/AdminLayout.vue'));
const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'));
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'));
const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'));
const Spinner = defineAsyncComponent(() => import('@/components/spinner/Spinner.vue'));
const ModalDelete = defineAsyncComponent(() => import('@/components/modal/ModalDelete.vue'));


const isAddModalOpen = ref(false);
const isLoading = ref(false)
const loading = ref(false)
const { t, locale } = useI18n({ useScope: "global" });
const toast = useToast()
const serviceStore = useServiceStore();
const isEditing = ref(false);
const departmentsData = ref<any[]>([])
const Users = ref<any[]>([])
const show = ref(false)
const loadingDelete = ref(false)
const selectedId = ref<number | null>(null)
const showModal = ref(false)
const selectedDepartment = ref<any | null>(null)
const selected = ref<any>(null);
const newDepartment = ref({
  name: '',
  description: '',
  manager: '',
  employeeCount: 0,
  status: 'active'
});



const openAddDepartmentModal = () => {
  isAddModalOpen.value = true;

};

const closeAddDepartmentModal = () => {
  isAddModalOpen.value = false;
  isEditing.value = false
  newDepartment.value = {
    name: '',
    description: '',
    manager: '',
    employeeCount: 0,
    status: 'active'
  };
};

const updateData = async () => {
  isLoading.value = true;

  try {
    const serviceId = serviceStore.serviceId;
    const id = selected.value?.id;

    if (!id) {
      toast.error(t('toast.selectError'));
      return;
    }

    const Payload = {
      service_id: serviceId,
      name: newDepartment.value.name,
      description: newDepartment.value.description,
      responsible_user_id: newDepartment.value.manager,
      number_employees: newDepartment.value.employeeCount

    };
    console.log('-->Payload', Payload);
    const result = await updateDpt(id, Payload);
    console.log('-->result', result);
    
    newDepartment.value = {
      name: '',
      description: '',
      manager: '',
      employeeCount: 0,
      status: 'active'
    };
    selected.value = null;
    isEditing.value = false;
    showModal.value = false;
    toast.success(t('toast.SucessUpdate'));
  } catch (error) {
    toast.error(t('error'));
    console.error('Erreur lors de la mise à jour:', error);

  } finally {
    isLoading.value = false;
  }
};

const fetchUser = async () => {
  try {
    const serviceId = serviceStore.serviceId;

    if (!serviceId) {
      throw new Error('Service ID is not defined');
    }

    const response = await getUserByServiceId(serviceId);
    const _users = JSON.parse(response.data.data);
    console.log("-->_users", _users);
    Users.value = _users.map((item: any) => ({
      label: item.user.firstName + ' ' + item.user.lastName,
      value: item.user.id
    }));


    console.log("Filtered users:", Users.value);
  } catch (error) {
    console.error('fetch failed:', error);
  }
};

const addDepartment = async () => {
  isLoading.value = true
  const serviceId = serviceStore.serviceId;
  try {
    if (isEditing.value) {
      await updateData();

    } else {
      // Création d'un nouveau mouvement
      const payload = {
        name: newDepartment.value.name,
        description: newDepartment.value.description,
        responsible_user_id: newDepartment.value.manager,
        number_employees: newDepartment.value.employeeCount,
        status: 'active',
        service_id: serviceId,

      };
      console.log('response', payload)
      const response = await createDepartment(payload);
      console.log('response', response)
      fetchDepartment()
      toast.success(t('toast.Sucess'));
    }

    closeAddDepartmentModal();

  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    toast.error(t('toast.error'));
  } finally {
    isLoading.value = false
  }

}

const importDepartment = async () => {
  isLoading.value = true
  const serviceId = serviceStore.serviceId;
  await departments.forEach(async (dept: any) => {
    const payload = {
      name: dept.name,
      description: dept.description,
      responsible_user_id: "",
      number_employees: 0,
      status: 'active',
      service_id: serviceId,

    };
    console.log('response', payload)
    const response = await createDepartment(payload);
    console.log('response', response)
  });
  isLoading.value = false;
  fetchDepartment()
}
const fetchDepartment = async () => {
  loading.value = true
  try {
    const serviceId = serviceStore.serviceId;
    console.log('Service ID:', serviceId);

    const departmentsResponse = await getDepartment(serviceId);
    const departments = departmentsResponse.data;
    console.log('Departments:', departments);

    if (!serviceId) {
      throw new Error('Service ID is not defined');
    }

    const response = await getUserByServiceId(serviceId);
    const userDetails = JSON.parse(response.data.data);
    console.log("-->_userDetails", userDetails);

    departments.forEach((dept: any) => {
      console.log('Processing dept:', dept.name, 'Responsible ID:', dept.responsibleUserId);

      const responsibleUser = userDetails.find(
        (item: any) => Number(item.user.id) === Number(dept.responsibleUserId)
      );

      if (responsibleUser) {
        console.log('Found responsible user:', responsibleUser.user.firstName ?? responsibleUser.user.firstName, responsibleUser.user.lastName ?? responsibleUser.user.lastName);
        dept.responsibleUserName = `${responsibleUser.user.firstName ?? responsibleUser.user.firstName} ${responsibleUser.user.lastName ?? responsibleUser.user.lastName}`;
      } else {
        console.log('No responsible user found for dept:', dept.name);
        dept.responsibleUserName = t('Unknown');
      }
    });

    departments.sort((a: any, b: any) => a.name.localeCompare(b.name));
    departmentsData.value = departments.map((d: any) => {
      const statusClasses = getStatusColor(d.status).split(' ')
      return {
        ...d,
        statusColor: {
          label: t(d.status),
          bg: statusClasses[0],
          text: statusClasses[1],
        },
      }
    })
    console.log('Final departments data:', departmentsData.value);
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
  } finally {
    loading.value = false
  }
};


watch(locale, fetchDepartment)

onMounted(async () => {
  await fetchUser()
  await fetchDepartment()
})





const titles = computed(() => [
  {
    name: 'id',
    label: t('ID'),
    type: 'text',
    sortable: true,
    filterable: false,
  },
  {
    name: 'name',
    label: t('Name'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'description',
    label: t('Description'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'responsibleUserName',
    label: t('manager'),
    type: 'text',
    event: 'view',
    filterable: true,
  },
  {
    name: 'statusColor',
    label: t('Status'),
    type: 'badge',
    filterable: false,
  },
  {
    name: 'numberEmployees',
    label: t('employees'),
    type: 'text',
    filterable: false,
  },
  {
    name: 'actions',
    label: t('Actions'),
    type: 'action',
    actions: [
      {
        name: 'View',
        event: 'view',
        icone: ` <svg class="h-6 w-6 text-orange-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="2" />  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />  <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>`,
      },
      {
        name: 'Edit',
        event: 'edit',
        icone: ` <svg class="h-6 w-6 text-blue-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
        </svg>`,
      },
      {
        name: 'Delete',
        event: 'delete',
        icone: `<svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>`,
      },
    ],
  },
])



const onEditDept = (dept: any) => handleDeptAction('edit', dept)
const onAddDepartment = (dept: any) => handleDeptAction('new', dept)
const onDeleteDept = (dept: any) => handleDeptAction('delete', dept)
const onView = (dept: any) => {
  router.push({ name: 'departmentDetails', params: { id: dept.id } })
}
const deptId = ref(null)
const handleDeptAction = (action: string, dept: any) => {
  deptId.value = dept.id
  if (action === 'edit') {
    const deptEdit = departmentsData.value.find((r: any) => r.id === Number(deptId.value));
    console.log("deptEdit", departmentsData.value)
    if (deptEdit) {
      selected.value = deptEdit;
      newDepartment.value.name = deptEdit.name
      newDepartment.value.description = deptEdit.description
      newDepartment.value.employeeCount = deptEdit.numberEmployees
      newDepartment.value.manager = deptEdit.responsibleUserId
    }
    isAddModalOpen.value = true
    isEditing.value = true
  } else if (action === 'delete') {
    selectedId.value = deptId.value
    show.value = true
  } else if (action === 'view') {
    const dept = departmentsData.value.find((d: any) => d.id === Number(deptId.value))
    if (dept) {
      selectedDepartment.value = dept
      showModal.value = true
    }
  } else if (action === 'new') {
   addDepartment();
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-500'
  }
}




const confirmDelete = async () => {
  if (selectedId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteDpt(selectedId.value)
      toast.success(t('toast.DeletedSuccess'))
      departmentsData.value = departmentsData.value.filter((r: any) => r.id !== selectedId.value);
      console.log(`Suppression du room type ID: ${selectedId.value}`)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error(t('toast.userDeleteError'))
    } finally {
      loadingDelete.value = false
      show.value = false
      selectedId.value = null
    }
  }
}

</script>

<style scoped>
/* Vous pouvez ajouter des styles spécifiques ici si nécessaire */
</style>
