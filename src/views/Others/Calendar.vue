<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('Calendar')" />
    <div class="flex justify-end mb-3">
      <GlobalFilter @filter="applyFilter" />

    </div>
    <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="custom-calendar">
        <FullCalendar ref="calendarRef" class="min-h-screen" :options="calendarOptions"
          :eventDidMount="handleTooltip" />
      </div>

      <!-- Modal -->
      <Modal v-if="isOpen" @close="closeModal()">
        <template #body>
          <div
            class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <h5 class="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
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
                <input v-model="eventTitle" type="text"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <div class="mt-6">
                <label class="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('event_color') }}
                </label>
                <div class="flex flex-wrap items-center gap-4 sm:gap-5">
                  <div v-for="(value, key) in calendarsEvents" :key="key" class="n-chk">
                    <div :class="`form-check form-check-${value} form-check-inline`">
                      <label class="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                        :for="`modal${key}`">
                        <span class="relative">
                          <input type="radio" :name="'event-level'" :value="key" :id="`modal${key}`"
                            v-model="eventLevel" class="sr-only form-check-input" />
                          <span
                            class="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
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
                <input v-model="eventStartDate" type="date"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('enter_end_date') }}
                </label>
                <input v-model="eventEndDate" type="date"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
            </div>

            <div class="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button @click="closeModal"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto">
                {{ $t('Close') }}
              </button>

              <button @click="handleAddOrUpdateEvent"
                class="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto">
                {{ selectedEvent ? $t('UpdateChanges') : $t('AddEvent') }}
              </button>
              <button v-if="selectedEvent" @click="handleDeleteEvent"
                class="flex w-full justify-center rounded-lg border border-error-500 bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600 sm:w-auto">
                {{ $t('delete_event') }}
              </button>
            </div>
          </div>
        </template>
      </Modal>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { filterReservation } from "@/services/api";
import { useServiceStore } from '@/composables/serviceStore';
import type { ReservationType } from '@/types/option'
import frLocale from '@fullcalendar/core/locales/fr';

// const currentPageTitle = ref('Calendar')
import { ref, reactive, onMounted, computed, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from '@/components/profile/Modal.vue'
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useI18n } from "vue-i18n";
import GlobalFilter from '@/components/filters/GlobalFilter.vue';
import type { FitlterItem } from '@/utils/models';
import { isLoading } from '@/composables/spinner';

const loading = ref(false)
const calendarRef = ref<any>(null)
const isOpen = ref(false)
const selectedEvent = ref<any>(null)
const eventTitle = ref('')
const eventStartDate = ref('')
const eventEndDate = ref('')
const eventLevel = ref('')
// const events = ref<any[]>([])
const { t, locale } = useI18n();
const serviceStore = useServiceStore();
const filtersValue = ref<FitlterItem>({
  checkInDate: '',
  checkOutDate: '',
  roomType: '',
  searchText: '',
  status: '',
})

const calendarsEvents = reactive({
  Danger: 'danger',
  Success: 'success',
  Primary: 'primary',
  Warning: 'warning',
})


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


const applyFilter = async (filter: FitlterItem) => {
  isLoading.value = true;
  reservations.value = [];
  const res = await filterReservation(serviceStore.serviceId!, filter);
  console.log('response', res);
  if (res.status === 200 || res.status === 201) {
    reservations.value = res.data;
    calendarEvents.value = res.data.map((res: any) => {
      const user = res.user;

      const start = new Date(res.arrivedDate).toISOString().split('T')[0];
      const endDate = new Date(res.departDate);
      endDate.setDate(endDate.getDate() + 1);
      const end = endDate.toISOString().split('T')[0];

      return {
        id: res.id.toString(),
        title: `${user ? user.firstName + ' ' + user.lastName : 'Inconnu'} - ${res.reservationNumber || ''}`,
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

  }
  isLoading.value = false
}

const events = computed(() => calendarEvents.value)


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

const handleDateSelect = (selectInfo: any) => {
  resetModalFields()
  console.log("selectInfo", selectInfo.startStr)
  eventStartDate.value = selectInfo.startStr
  eventEndDate.value = selectInfo.endStr || selectInfo.startStr
  openModal()
}

const handleEventClick = (clickInfo: any) => {
  const event = clickInfo.event
  selectedEvent.value = event
  window.open(`/reservation_details/${event.extendedProps.id}`, '_blank');
}

const handleAddOrUpdateEvent = () => {
  if (selectedEvent.value) {
    // Update existing event
    calendarEvents.value = calendarEvents.value.map((event: any) =>
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
    calendarEvents.value = calendarEvents.value.filter((event: any) => event.id !== selectedEvent.value.id)
    closeModal()
  }
}

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
      <div class="w-full truncate h-full text-sm font-semibold px-2 py-1 rounded-lg shadow-md ${colorClass} flex flex-wrap items-center justify-center">
        ${title}
      </div>
    `
  }
}
const handleDateClick = (info: any) => {
  console.log('date click!', info)
  filtersValue.value.checkInDate = info.start?.toISOString().split('T')[0] || ''
  filtersValue.value.checkOutDate = info.end?.toISOString().split('T')[0] || ''
  console.log('date click!', filtersValue.value)
  applyFilter(filtersValue.value)
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
  datesSet: handleDateClick,
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

watch(locale, (newLocale: any) => {
  const calendarApi = calendarRef.value?.getApi()
  if (calendarApi) {
    calendarApi.setOption('locale', newLocale)
  }
})
onMounted(async () => {
 // await applyFilter(filtersValue.value)
 // loading.value = false
})
</script>
