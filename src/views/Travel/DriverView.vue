<template>
    <div>
      <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="space-y-5 sm:space-y-6 h-screen">

            <div class="flex flex-col gap-10 mt-10 ">
              <TableOne
                :items="titles"
                :datas="usersWithRoleLabels"
                :options="filterOptions"
                :filterable="true"
                :pagination="true"
                @edit="onEditUser"
                @delete="onDeleteUser"
              />
          </div>
          <!-- </DefaultCard> -->
    </div>
  </AdminLayout>

  <Modal v-if="modalOpen" @close="closeModal()">
      <template #body>
        <div
        class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
        <!-- close btn -->
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
       {{ isEditMode ? $t('EditUser') : $t('New Driver') }}
      </h4>

    </div>
    <form @submit.prevent="handleSubmit" class="flex flex-col">
      <div class="custom-scrollbar h-[300px] overflow-y-auto p-2">
        <div class="space-y-8">
          <!-- Section principale -->
          <div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              <Input
                :lb="$t('FirstName')"
                :id="'name'"
                :forLabel="'name'"
                v-model="form.firstName"
              />

              <Input
                :lb="$t('LastName')"
                :id="'last'"
                :forLabel="'last'"
                 v-model="form.lastName"
              />
              <Input
                :lb="$t('Phone')"
                :id="'phone'"
                :forLabel="'phone'"
                :inputType="'phone'"
                 v-model="form.phoneNumber"
              />

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('Email') }}
                  </label>
                  <div class="relative">
                    <span
                      class="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.04175 7.06206V14.375C3.04175 14.6511 3.26561 14.875 3.54175 14.875H16.4584C16.7346 14.875 16.9584 14.6511 16.9584 14.375V7.06245L11.1443 11.1168C10.457 11.5961 9.54373 11.5961 8.85638 11.1168L3.04175 7.06206ZM16.9584 5.19262C16.9584 5.19341 16.9584 5.1942 16.9584 5.19498V5.20026C16.9572 5.22216 16.946 5.24239 16.9279 5.25501L10.2864 9.88638C10.1145 10.0062 9.8862 10.0062 9.71437 9.88638L3.07255 5.25485C3.05342 5.24151 3.04202 5.21967 3.04202 5.19636C3.042 5.15695 3.07394 5.125 3.11335 5.125H16.8871C16.9253 5.125 16.9564 5.15494 16.9584 5.19262ZM18.4584 5.21428V14.375C18.4584 15.4796 17.563 16.375 16.4584 16.375H3.54175C2.43718 16.375 1.54175 15.4796 1.54175 14.375V5.19498C1.54175 5.1852 1.54194 5.17546 1.54231 5.16577C1.55858 4.31209 2.25571 3.625 3.11335 3.625H16.8871C17.7549 3.625 18.4584 4.32843 18.4585 5.19622C18.4585 5.20225 18.4585 5.20826 18.4584 5.21428Z"
                          fill="#667085"
                        />
                      </svg>
                    </span>
                    <input
                      type="email"
                      v-model="form.email"
                      placeholder="info@gmail.com"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-[62px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>
                </div>
                <!-- <Input
                :lb="$t('Password')"
                :id="'word'"
                :forLabel="'word'"
                v-model="form.password"
              /> -->
              <!-- <Select
                :lb="$t('Role')"
                :options="roles"
                v-model="form.role"
              /> -->

            </div>
          </div>
        </div>





      </div>
      <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
      <!-- Bouton Cancel -->
      <button
        @click="closeModal()"
        type="button"
        class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
        :disabled="isLoading"
      >
        {{ $t('Cancel') }}
      </button>

      <!-- Bouton Add Room avec Spinner intégré -->
      <button
        type="submit"
        :disabled="isLoading"
        class="relative flex w-full justify-center items-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 transition disabled:opacity-50 sm:w-auto"
      >
        <span v-if="!isLoading"> {{ isEditMode ? $t('EditUser') : $t('Save') }}</span>
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
  <ModalDelete v-if="show" @close="show = false"
        @delete="confirmDelete"
        :isLoading="loadingDelete"/>
    </div>
  </template>

  <script setup lang="ts">
  import { ref ,computed,defineAsyncComponent,onMounted} from 'vue'
  import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
  import AdminLayout from "@/components/layout/AdminLayout.vue";
  import { useToast } from 'vue-toastification'
  import Spinner from '@/components/spinner/Spinner.vue';
  import { useServiceStore } from '@/composables/serviceStore'
  import { createUser,getUser, deleteUser,updateUser,getRole } from "@/services/api";
  import { useI18n } from "vue-i18n";
  import DropdownMenu from '@/components/common/DropdownMenu.vue'
  import { useAuthStore } from '@/composables/user';
  import type {userDataType} from "@/types/option"
  import TableOne from '@/components/tables/TableOne.vue'



  const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'));
  const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'));
  const DefaultCard = defineAsyncComponent(() => import('@/components/common/DefaultCard.vue'))
  const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'))
  const ModalDelete = defineAsyncComponent(() => import('@/components/modal/ModalDelete.vue'))
  const { t, locale } = useI18n({ useScope: "global" });


  const isLoading = ref(false);
  const loadingDelete = ref(false)
  const serviceStore = useServiceStore()
  const toast = useToast()
  const userStore = useAuthStore();
  const selectedUserId = ref<number | null>(null)
  const show=ref(false)
  const menuItems = computed(()=>[
    { label: t('Add Driver'), onClick: () => OpenModal() },
  ])


  const modalOpen = ref(false)
  const currentPageTitle = computed(()=>t("Driver List"));
  const users = ref<userDataType[]>([])
  const selectedUser = ref<any>(null);
  const isEditMode = ref(false);
  const roles = ref<any[]>([])

  interface User {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    roleId: number;
    // autres propriétés si nécessaire
  }


  interface Form {
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    password:string
    role: number | undefined
  }


  const form = ref<Form>({
    firstName: '',
    lastName: '',
    role: 0,
    phoneNumber: '',
    email: '',
    password:'',
  })


  const saveUser = async () => {
    isLoading.value = true;
    try {
      const serviceId = serviceStore.serviceId;
      const userPayload = {
        service_id : serviceId,
        first_name: form.value.firstName,
        last_name: form.value.lastName,
        email: form.value.email,
        phone_number: form.value.phoneNumber,
        role_id: Number(form.value.role),
        password:form.value.password,
        created_by : userStore.UserId ,



      }
      console.log('✅ userPayload', userPayload)

      const response = await createUser(userPayload)
      modalOpen.value = false;

      form.value = {
        firstName: '',
        lastName: '',
        role: 0,
        phoneNumber: '',
        email: '',
        password:''
      }
      if (response.status === 201) {
        toast.success(t('toast.userCreated'));
      } else {
        toast.error(t('toast.userErrorCreated'));
      }
      console.log('✅ Réservation créée avec succès !', response.data)
    } catch (error: any) {
      console.error('❌ Error while saving:', error.response?.data || error.message)
    }finally {
      isLoading.value = false;
    }
  }

  const fetchUser = async () => {
    try {
      const serviceId = serviceStore.serviceId;

      if (!serviceId) {
        throw new Error('Service ID is not defined');
      }

      const response = await getUser();
      console.log("All users:", response.data.data);
      // users.value = response.data.data.filter((user: any) =>
      // [6].includes(user.roleId) && user.serviceId === serviceId
      // );
      users.value = response.data.data.filter((user: any) => {
        const role = roles.value.find((r: any) => Number(r.id) === Number(user.roleId))
        console.log('user:', user, 'role:', role)
        return (
          role?.roleName.toLowerCase() === 'driver' &&
          user.serviceId === serviceId
        )
      })


      console.log("Filtered users:", users.value);
    } catch (error) {
      console.error('fetch failed:', error);
    }
  };
  onMounted(async()=>{
  await fetchRole()
  await fetchUser()
})
  const titles = computed(() => [
    {
      name: 'id',
      label: t('ID'),
      type: 'text',
      filterable: false,
    },
    {
      name: 'firstName',
      label: t('FirstName'),
      type: 'text',
      filterable: true,
    },
    {
      name: 'lastName',
      label: t('LastName'),
      type: 'text',
      filterable: true,
    },
    {
      name: 'email',
      label: t('Email'),
      type: 'url',
      event: "view",
      filterable: true,
    },
    {
      name: 'phoneNumber',
      label: t('Phone'),
      type: 'text',
      filterable: false,
    },
    // {
    //   name: 'roleLabel',
    //   label: t('Role'),
    //   type: 'text',
    //   filterable: false,

    // },
    {
      name: 'actions',
    label: t('Actions'),
    type: 'action',
    actions: [
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
        color: 'bg-red-100 text-red-600 px-2 py-1 rounded-full'
      }
    ],
    colored: true
    }
  ]);


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

const fetchRole = async() =>{
  try {
  const response =  await getRole()
  roles.value = response.data.data
  console.log("response",response.data.data)
  } catch (error) {
    console.error('fetch failed:', error)
  }
}

const getRoleBadge = (roleName: string) => {
  const roleMap: Record<string, { bg: string; text: string; label: string }> = {
    admin: {
      label: 'Administrator',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
    },
    user: {
      label: 'User',
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
    driver: {
      label: 'Driver',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
    },
    guest: {
      label: 'Guest',
      bg: 'bg-gray-100',
      text: 'text-gray-800',
    },
  }

  return roleMap[roleName] || {
    label: roleName,
    bg: 'bg-purple-100',
    text: 'text-purple-800',
  }
}

const usersWithRoleLabels = computed(() =>
  users.value.map((user: any) => {
    const role = roles.value.find((r: any) => r.id === user.roleId)?.roleName || 'Unknown'
    return {
      ...user,
      roleLabel: role,
      roleBadge: getRoleBadge(role),
    }
  })
)

  const onEditUser = (user: User) => handleUserAction('edit', user);
  const onDeleteUser = (user: User) => handleUserAction('delete', user);


  const handleUserAction = (action: string, user: User) => {
    if (action === 'edit') {
      selectedUser.value = user;
      form.value.firstName = user.firstName;
      form.value.lastName = user.lastName;
      form.value.phoneNumber = user.phoneNumber;
      form.value.email = user.email;
     // form.value.role = roles.value.find((r: any) => r.value === String(user.roleId))?.value;
      isEditMode.value = true;
      modalOpen.value = true;
    } else if (action === 'delete') {
      selectedUserId.value = user.id;
      show.value = true;
    }
  };




  const confirmDelete = async () => {
    if (selectedUserId.value !== null) {
      loadingDelete.value = true
      try {
        await deleteUser(selectedUserId.value)
        toast.success(t('toast.userDeleted'))
        users.value = users.value.filter((r: any) => r.id !== selectedUserId.value);
        console.log(`Suppression du user ID: ${selectedUserId.value}`)
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        toast.error(t('toast.userDeleteError'))
      } finally {
        loadingDelete.value = false
        show.value = false
      selectedUserId.value = null
      }
    }
  }




  const updateFormData = async () => {
    isLoading.value = true;

    try {
      const serviceId = serviceStore.serviceId;
      const userId = selectedUser.value?.id;

      if (!userId) {
        toast.error("Aucun utilisateur sélectionné pour la mise à jour.");
        return;
      }

      const userPayload = {
        service_id: serviceId,
        first_name: form.value.firstName,
        last_name: form.value.lastName,
        email: form.value.email,
        phone_number: form.value.phoneNumber,
        role_id: Number(form.value.role),
        password: form.value.password,
        last_modified_by: userStore.UserId,
      };

      console.log('Payload envoyé :', userPayload);
      await updateUser(userId, userPayload);

      toast.success(t('toast.userUpdatedSuccess'));

      // Réinitialisation du formulaire
      form.value = {
        firstName: '',
        lastName: '',
        role: 0,
        phoneNumber: '',
        email: '',
        password: '',
      };
      selectedUser.value = null;
      isEditMode.value = false;
      modalOpen.value = false;

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error(t('toast.updateError'));
    } finally {
      isLoading.value = false;
    }
  };




  const handleSubmit = async () => {
    isLoading.value = true
    try {
      if (isEditMode.value) {
        await updateFormData()
      } else {
        await saveUser()
      }
      // router.push('/reservations') // Redirige une fois terminé
    } finally {
      isLoading.value = false
    }
  }

  const closeModal = () => {
    modalOpen.value = false;
    isEditMode.value = false;

    form.value = {
    firstName: '',
    lastName: '',
    role: 0,
    phoneNumber: '',
    email: '',
    password:'',
    };


  };

  const OpenModal = () =>{
    modalOpen.value=true;
    isEditMode.value = false;
  }

  </script>

  <style scoped>

  </style>
