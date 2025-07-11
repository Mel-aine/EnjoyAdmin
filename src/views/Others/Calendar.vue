<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('Calendar')" />
    <div
      class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="custom-calendar">
        <FullCalendar ref="calendarRef" class="min-h-screen" :options="calendarOptions" :eventDidMount="handleTooltip" />
      </div>

      <!-- Modal -->
      <Modal v-if="isOpen" @close="closeModal()">
        <template #body>
          <div
            class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
          >
            <h5
              class="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl"
            >
              {{ selectedEvent ? $t('EditEvent') : $t('AddEvent') }}
            </h5>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ $t('plan_your') }}
            </p>

            <div class="mt-8">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('event_title') }}
                </label>
                <input
                  v-model="eventTitle"
                  type="text"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="mt-6">
                <label class="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('event_color') }}
                </label>
                <div class="flex flex-wrap items-center gap-4 sm:gap-5">
                  <div v-for="(value, key) in calendarsEvents" :key="key" class="n-chk">
                    <div :class="`form-check form-check-${value} form-check-inline`">
                      <label
                        class="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                        :for="`modal${key}`"
                      >
                        <span class="relative">
                          <input
                            type="radio"
                            :name="'event-level'"
                            :value="key"
                            :id="`modal${key}`"
                            v-model="eventLevel"
                            class="sr-only form-check-input"
                          />
                          <span
                            class="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700"
                          >
                            <span class="w-2 h-2 bg-white rounded-full dark:bg-transparent"></span>
                          </span>
                        </span>
                        {{ t(`Keys.${key}`) }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                 {{ $t('enter_start_date') }}
                </label>
                <input
                  v-model="eventStartDate"
                  type="date"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('enter_end_date') }}
                </label>
                <input
                  v-model="eventEndDate"
                  type="date"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div class="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                @click="closeModal"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                {{ $t('Close') }}
              </button>

              <button
                @click="handleAddOrUpdateEvent"
                class="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {{ selectedEvent ? $t('UpdateChanges') : $t('AddEvent') }}
              </button>
              <button
                v-if="selectedEvent"
                @click="handleDeleteEvent"
                class="flex w-full justify-center rounded-lg border border-error-500 bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600 sm:w-auto"
              >
                {{ $t('delete_event') }}
              </button>
            </div>
          </div>
        </template>
      </Modal>
      <!-- <Teleport to="body">
        <div v-if="isOpen" class="modal-backdrop" @click="closeModal"></div>
        <div v-if="isOpen" class="modal">
          <div >
            <h5
              class="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl"
            >
              {{ selectedEvent ? 'Edit Event' : 'Add Event' }}
            </h5>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Plan your next big moment: schedule or edit an event to stay on track
            </p>

            <div class="mt-8">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Title
                </label>
                <input
                  v-model="eventTitle"
                  type="text"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="mt-6">
                <label class="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Color
                </label>
                <div class="flex flex-wrap items-center gap-4 sm:gap-5">
                  <div v-for="(value, key) in calendarsEvents" :key="key" class="n-chk">
                    <div :class="`form-check form-check-${value} form-check-inline`">
                      <label
                        class="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                        :for="`modal${key}`"
                      >
                        <span class="relative">
                          <input
                            type="radio"
                            :name="'event-level'"
                            :value="key"
                            :id="`modal${key}`"
                            v-model="eventLevel"
                            class="sr-only form-check-input"
                          />
                          <span
                            class="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700"
                          >
                            <span class="w-2 h-2 bg-white rounded-full dark:bg-transparent"></span>
                          </span>
                        </span>
                        {{ key }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter Start Date
                </label>
                <input
                  v-model="eventStartDate"
                  type="date"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter End Date
                </label>
                <input
                  v-model="eventEndDate"
                  type="date"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div class="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                @click="closeModal"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
              <button
                @click="handleAddOrUpdateEvent"
                class="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {{ selectedEvent ? 'Update Changes' : 'Add Event' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport> -->
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { getReservation,getUser,getServiceProduct,deleteReservation} from "@/services/api";
import { useServiceStore } from '@/composables/serviceStore';
import type {ReservationType,userDataType,ServiceProductType} from '@/types/option'
import frLocale from '@fullcalendar/core/locales/fr';


// const currentPageTitle = ref('Calendar')
import { ref, reactive, onMounted,computed,watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from '@/components/profile/Modal.vue'
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useI18n } from "vue-i18n";


const calendarRef = ref<any>(null)
const isOpen = ref(false)
const selectedEvent = ref<any>(null)
const eventTitle = ref('')
const eventStartDate = ref('')
const eventEndDate = ref('')
const eventLevel = ref('')
// const events = ref<any[]>([])
  const { t,locale } = useI18n();
const serviceStore = useServiceStore();

const calendarsEvents = reactive({
  Danger: 'danger',
  Success: 'success',
  Primary: 'primary',
  Warning: 'warning',
})

const users = ref<userDataType[]>([])
const selectedReservation = ref<any>(null);



const fetchUsers = async () => {
  const response = await getUser();
  users.value = response.data.data;
  console.log('userrr',users.value)
}


const serviceProducts = ref<ServiceProductType[]>([])
const fetchServiceProduct = async () => {
  try {
    // const serviceId = serviceStore.serviceId
    const serviceId = 4
    const response = await getServiceProduct(serviceId);
   serviceProducts.value = response.data;
     console.log("hhh", serviceProducts.value)

  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }
};

const getCalendarColorByStatus = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Success';
    case 'pending':
      return 'Warning';
    case 'cancelled':
      return 'Danger';
    default:
      return 'Primary';
  }
};


const reservations = ref<ReservationType[]>([])

const calendarEvents = ref<any[]>([])

const fetchReservation = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getReservation(serviceId);

    // Store raw reservations
    reservations.value = response.data;

    // Build calendar events
    // calendarEvents.value = response.data.map((res: any) => {
    //   const user = users.value.find((u: any) => u.id === res.userId);
    //   const arrivedDate = res.arrivedDate ? new Date(res.arrivedDate) : null;
    //   const departDate = res.departDate ? new Date(res.departDate) : null;
    //   return {
    //     id: res.id.toString(),
    //     title: `${user ? user.firstName + ' ' + user.lastName : 'Inconnu'}- ${user?.email || ''}`,
    //     start: arrivedDate ? arrivedDate.toISOString().split('T')[0] : null,
    //     end: departDate ? departDate.toISOString().split('T')[0] : null,
    //     // end: new Date(new Date(res.departDate).setDate(new Date(res.departDate).getDate() + 1)).toISOString().split('T')[0],
    //     allDay: true,
    //     extendedProps: {
    //     calendar: getCalendarColorByStatus(res.status),
    //     title: `${user?.firstName || 'Inconnu'} - ${user?.email || ''}`,
    //     description: res.comment || 'No comment',
    //     email :`${user?.email || ''}`,
    //     room : res.reservationProduct,
    //     reservationType:res.reservationType,


    //       ...res,
    //     },
    //   }

    // });
    calendarEvents.value = response.data.map((res: any) => {
      const user = users.value.find((u: any) => u.id === res.userId);

      const start = new Date(res.arrivedDate).toISOString().split('T')[0];
      const endDate = new Date(res.departDate);
      endDate.setDate(endDate.getDate() + 1);
      const end = endDate.toISOString().split('T')[0];

      return {
        id: res.id.toString(),
        title: `${user ? user.firstName + ' ' + user.lastName : 'Inconnu'} - ${user?.email || ''}`,
        start: start,
        end: end,
        allDay: true,
        extendedProps: {
          calendar: getCalendarColorByStatus(res.status),
          title: `${user?.firstName || 'Inconnu'} - ${user?.email || ''}`,
          description: res.comment || 'No comment',
          email: `${user?.email || ''}`,
          room: res.reservationProduct,
          reservationType: res.reservationType,
          ...res,
        },
      };
    });

    console.log("calendar.value",calendarEvents.value)
  } catch (error) {
    console.error('fetch failed:', error);
  }
};

const events = computed(() => calendarEvents.value)


onMounted(async () => {
  await fetchUsers();
  await fetchServiceProduct();
  await fetchReservation();
});


// onMounted(() => {
//   // events.value = [
//   //   {
//   //     id: '1',
//   //     title: 'Event Conf.',
//   //     start: new Date().toISOString().split('T')[0],
//   //     extendedProps: { calendar: 'Danger' },
//   //   },
//   //   {
//   //     id: '2',
//   //     title: 'Meeting',
//   //     start: new Date(Date.now() + 86400000).toISOString().split('T')[0],
//   //     extendedProps: { calendar: 'Success' },
//   //   },
//   //   {
//   //     id: '3',
//   //     title: 'Workshop',
//   //     start: new Date(Date.now() + 172800000).toISOString().split('T')[0],
//   //     end: new Date(Date.now() + 259200000).toISOString().split('T')[0],
//   //     extendedProps: { calendar: 'Primary' },
//   //   },
//   // ]
// })

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  resetModalFields()
}

const resetModalFields = () => {
  eventTitle.value = ''
  eventStartDate.value = ''
  eventEndDate.value = ''
  eventLevel.value = ''
  selectedEvent.value = null
}

const handleDateSelect = (selectInfo:any) => {
  resetModalFields()
  console.log("selectInfo",selectInfo.startStr)
  eventStartDate.value = selectInfo.startStr
  eventEndDate.value = selectInfo.endStr || selectInfo.startStr
  openModal()
}

const handleEventClick = (clickInfo:any) => {
  const event = clickInfo.event
  selectedEvent.value = event
  console.log("event",event.start)
  eventTitle.value = event.title
  eventStartDate.value = event.start?.toLocaleDateString('fr-CA') || ''
  eventEndDate.value = event.end?.toISOString().split('T')[0] || ''
  eventLevel.value = event.extendedProps.calendar
  openModal()
}

const handleAddOrUpdateEvent = () => {
  if (selectedEvent.value) {
    // Update existing event
    calendarEvents.value = calendarEvents.value.map((event:any) =>
      event.id === selectedEvent.value.id
        ? {
            ...event,
            title: eventTitle.value,
            start: eventStartDate.value,
            end: eventEndDate.value,
            extendedProps: { calendar: eventLevel.value },
          }
        : event,
    )
  } else {
    // Add new event
    const newEvent = {
      id: Date.now().toString(),
      title: eventTitle.value,
      start: eventStartDate.value,
      end: eventEndDate.value,
      allDay: true,
      extendedProps: { calendar: eventLevel.value },
    }
    events.value.push(newEvent)
  }
  closeModal()
}
const handleDeleteEvent = () => {
  if (selectedEvent.value) {
    calendarEvents.value = calendarEvents.value.filter((event:any) => event.id !== selectedEvent.value.id)
    closeModal()
  }
}

// const renderEventContent = (eventInfo: any) => {
//   const calendarType = eventInfo.event.extendedProps.calendar?.toLowerCase() || 'default'
//   const title = eventInfo.event.title || 'Événement'

//   const bgColorMap: Record<string, string> = {
//     success: 'bg-green-500 text-white',
//     danger: 'bg-red-500 text-white',
//     warning: 'bg-orange-200 text-black',
//     primary: 'bg-blue-500 text-white',
//     default: 'bg-gray-500 text-white'
//   }

//   const colorClass = bgColorMap[calendarType] || bgColorMap.default

//   return {
//     html: `
//       <div class="text-sm font-medium px-2 py-1 lg:w-33 w-15 text-center rounded-md whitespace-normal leading-tight overflow-hidden text-ellipsis ${colorClass}">
//         ${title}
//       </div>
//     `
//   }
// }

const renderEventContent = (eventInfo: any) => {
  const calendarType = eventInfo.event.extendedProps.calendar?.toLowerCase() || 'default'
  const title = eventInfo.event.title || 'Événement'

  const bgColorMap: Record<string, string> = {
    success: 'bg-green-500 text-white',
    danger: 'bg-red-500 text-white',
    warning: 'bg-orange-200 text-black',
    primary: 'bg-blue-500 text-white',
    default: 'bg-gray-500 text-white'
  }

  const colorClass = bgColorMap[calendarType] || bgColorMap.default

  return {
    html: `
      <div class="w-full h-full text-sm font-semibold px-2 py-1 rounded-lg shadow-md ${colorClass} flex items-center justify-center">
        ${title}
      </div>
    `
  }
}





const calendarOptions = reactive({
  locale: locale.value,
  locales: [frLocale],
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next addEventButton',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  events: events,
  selectable: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventContent: renderEventContent,
  eventDisplay: 'block',
  eventOrder: 'start,title',
  eventClassNames: (arg: any) => ['text-sm', 'rounded', 'shadow', 'px-2', 'py-1'],
  customButtons: {
    addEventButton: {
      text: t('AddEvent+'),
      click: openModal,
    },
  },
height: "auto",
  dayMaxEventRows: true,
  views: {
    dayGridMonth: {
      dayMaxEventRows: 6,
    }
  },
  eventDidMount: (info: any) => {
    // Tooltip responsive
    tippy(info.el, {
      content: `
       <div class="tooltip-content text-sm leading-relaxed text-white">
        <div class="mb-1 font-semibold text-base text-purple-600">${info.event.title}</div>

        <div><strong>📧 ${t('tooltip.email')}  :</strong> ${info.event.extendedProps.email}</div>
        <div><strong>🚪 ${t('tooltip.room')}:</strong> ${info.event.extendedProps.room}</div>
        <div><strong>👤 ${t('tooltip.reservationType')} :</strong> ${info.event.extendedProps.reservationType}</div>
        <div><strong>🛬 ${t('tooltip.arrival')} :</strong> ${info.event.start?.toISOString().split('T')[0] || ''}</div>
        <div><strong>🛫 ${t('tooltip.departure')} :</strong> ${info.event.end?.toISOString().split('T')[0] || ''}</div>

        ${info.event.extendedProps.comment
          ? `<div><strong>📝 ${t('tooltip.comment')} :</strong> ${info.event.extendedProps.comment}</div>`
          : ''}
      </div>

      `,
      allowHTML: true,
      placement: 'top',
      theme: 'light-border',
      arrow: true,
    })
  },
})

const handleTooltip = (info: any) => {
  const comment = info.event.extendedProps.comment || 'no comment';
  tippy(info.el, {
    content: comment,
    placement: 'top',
    theme: 'light-border',
    arrow: true,
    delay: [100, 0],
  });
};

watch(locale, (newLocale:any) => {
  const calendarApi = calendarRef.value?.getApi()
  if (calendarApi) {
    calendarApi.setOption('locale', newLocale)
  }
})

</script>

