
<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('Calendar')" />
    <div class="flex justify-end mb-3">
      <GlobalFilter @filter="applyFilter" />
    </div>

    <!-- Notification pour les modifications -->
    <div
      v-if="dragNotification"
      class="mb-4 p-4 rounded-lg border-l-4"
      :class="
        dragNotification.type === 'success'
          ? 'bg-green-50 border-green-400 text-green-700'
          : 'bg-red-50 border-red-400 text-red-700'
      "
    >
      {{ dragNotification.message }}
    </div>

    <div
      class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="custom-calendar">
        <FullCalendar
          ref="calendarRef"
          class="min-h-screen"
          :options="calendarOptions"
          :eventDidMount="handleTooltip"
        />
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

      <!-- Modal de confirmation pour les modifications -->
      <Modal v-if="showConfirmModal" @close="cancelDragOperation">
        <template #body>
          <div
            class="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900"
          >
            <h5 class="mb-4 font-semibold text-gray-800 text-xl dark:text-white/90">
              {{ $t('ConfirmReservationChange') }}
            </h5>

            <div class="mb-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>{{ $t('Customer') }}:</strong> {{ pendingDragInfo?.title }}
              </p>
              <p>
                <strong>{{ $t('OldDates') }}:</strong>
                {{ formatDateRange(pendingDragInfo?.oldStart, pendingDragInfo?.oldEnd) }}
              </p>
              <p>
                <strong>{{ $t('NewDates') }}:</strong>
                {{ formatDateRange(pendingDragInfo?.newStart, pendingDragInfo?.newEnd) }}
              </p>
              <p class="text-blue-600">
                <strong>{{ $t('duration') }}:</strong>
                {{ calculateNights(pendingDragInfo?.newStart, pendingDragInfo?.newEnd) }}
                {{ $t('nights') }}
              </p>
            </div>

            <div class="flex items-center gap-3 justify-end">
              <button
                @click="cancelDragOperation"
                class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              >
                {{ $t('Cancel') }}
              </button>
              <button
                @click="confirmDragOperation"
                :disabled="loading"
                class="px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
              >
              <span v-if="!loading">{{ $t('confirm') }}</span>
              <span v-else class="flex items-center gap-2">
                <Spinner class="w-4 h-4" />
                {{ $t('Processing') }}...
              </span>

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
import { filterReservation, confirmExtendStay } from '@/services/api'
import { useServiceStore } from '@/composables/serviceStore'
import type { ReservationType } from '@/types/option'
import frLocale from '@fullcalendar/core/locales/fr'
import Spinner from '@/components/spinner/Spinner.vue'

import { ref, reactive, onMounted, computed, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from '@/components/profile/Modal.vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import { useI18n } from 'vue-i18n'
import GlobalFilter from '@/components/filters/GlobalFilter.vue'
import type { FitlterItem } from '@/utils/models'
import { isLoading } from '@/composables/spinner'
import { formatDateT } from '@/components/utilities/UtilitiesFunction'

const loading = ref(false)
const calendarRef = ref<any>(null)
const isOpen = ref(false)
const selectedEvent = ref<any>(null)
const eventTitle = ref('')
const eventStartDate = ref('')
const eventEndDate = ref('')
const eventLevel = ref('')

// Nouvelles variables pour le glisser-déposer
const showConfirmModal = ref(false)
const pendingDragInfo = ref<any>(null)
const dragNotification = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const { t, locale } = useI18n()
const serviceStore = useServiceStore()
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
      return 'Success'
    case 'pending':
      return 'Warning'
    case 'cancelled':
      return 'Danger'
    case 'checked_in':
      return 'Primary'
    default:
      return 'Default'
  }
}

const reservations = ref<ReservationType[]>([])
const calendarEvents = ref<any[]>([])

const applyFilter = async (filter: FitlterItem) => {
  isLoading.value = true
  reservations.value = []
  const res = await filterReservation(serviceStore.serviceId!, filter)
  console.log('response', res)
  if (res.status === 200 || res.status === 201) {
    reservations.value = res.data
    calendarEvents.value = res.data.map((res: any) => {
      const user = res.user

      const start = new Date(res.arrivedDate).toISOString().split('T')[0]
      const endDate = new Date(res.departDate)
      endDate.setDate(endDate.getDate() + 1)
      const end = endDate.toISOString().split('T')[0]

      return {
        id: res.id.toString(),
        title: `${user ? user.firstName + ' ' + user.lastName : t('Unknown')} - ${res.reservationNumber || ''}`,
        start: start,
        end: end,
        allDay: true,
        extendedProps: {
          calendar: getCalendarColorByStatus(res.status),
          title: `${user?.firstName || t('Unknown')} - ${user?.email || ''}`,
          description: res.comment || 'No comment',
          email: `${user?.email || ''}`,
          status: res.status,
          room: Array.isArray(res.reservationServiceProducts)
            ? res.reservationServiceProducts
                .map((r: any) => {
                  const product = r.serviceProduct
                  const name = product?.productName || t('Unknown')
                  const number = product?.roomNumber || '---'
                  return `${name} - ${number}`
                })
                .join(', ')
            : '',
          reservationType: res.reservationType,
          originalReservation: res, // Garder une référence à la réservation originale
          ...res,
        },
      }
    })
  }
  isLoading.value = false
}

const events = computed(() => calendarEvents.value)

// Nouvelles méthodes pour le glisser-déposer
const handleEventDrop = (dropInfo: any) => {
  console.log('Event dropped:', dropInfo)

  // Empêcher la mise à jour automatique
  dropInfo.revert()

  // Stocker les informations de l'opération de glissement
  pendingDragInfo.value = {
    status: dropInfo.event.extendedProps.status,
    event: dropInfo.event,
    oldStart: dropInfo.oldEvent.start,
    oldEnd: dropInfo.oldEvent.end,
    newStart: dropInfo.event.start,
    newEnd: dropInfo.event.end,
    title: dropInfo.event.title,
    reservationId: dropInfo.event.id,
  }

  // Afficher le modal de confirmation
  showConfirmModal.value = true
}

const handleEventResize = (resizeInfo: any) => {
  console.log('Event resized:', resizeInfo)

  // Empêcher la mise à jour automatique
  resizeInfo.revert()

  // Stocker les informations de l'opération de redimensionnement
  pendingDragInfo.value = {
    status: resizeInfo.event.extendedProps.status,
    event: resizeInfo.event,
    oldStart: resizeInfo.oldEvent.start,
    oldEnd: resizeInfo.oldEvent.end,
    newStart: resizeInfo.event.start,
    newEnd: resizeInfo.event.end,
    title: resizeInfo.event.title,
    reservationId: resizeInfo.event.id,
  }

  // Afficher le modal de confirmation
  showConfirmModal.value = true
}

const confirmDragOperation = async () => {
  if (!pendingDragInfo.value) return;

  const { status, reservationId, newStart, newEnd } = pendingDragInfo.value;

  // Vérifier si la réservation peut être modifiée
  if (status === 'checked_out' || status === 'cancelled') {
    showNotification(t('cannotModifyReservation'), 'error')
    showConfirmModal.value = false;
    pendingDragInfo.value = null;
    return;
  }

  loading.value = true;

  try {
    const updatedReservation = {
      new_depart_date: newEnd.toISOString().split('T')[0],
    };

    console.log('ID envoyé à l’API:', reservationId);

    const response = await confirmExtendStay(reservationId, updatedReservation);
    console.log('API response:', response);

    if (response.status === 200 || response.status === 201) {
      // Mise à jour de l’événement dans le calendrier
      const eventIndex = calendarEvents.value.findIndex((e) => e.id === reservationId);
      if (eventIndex !== -1) {
        calendarEvents.value[eventIndex] = {
          ...calendarEvents.value[eventIndex],
          start: newStart.toISOString().split('T')[0],
          end: newEnd.toISOString().split('T')[0],
        };
      }

     showNotification(
        t('reservationUpdated', { dates: formatDateRange(newStart, newEnd) }),
        'success'
      )

      // Rafraîchissement du calendrier
      const calendarApi = calendarRef.value?.getApi();
      calendarApi?.refetchEvents();
    } else {
      showNotification(t('updateError'), 'error')
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    showNotification(t('updateError'), 'error')
  } finally {
    loading.value = false;
    showConfirmModal.value = false;
    pendingDragInfo.value = null;
  }
};


const cancelDragOperation = () => {
  showConfirmModal.value = false
  pendingDragInfo.value = null
}

const formatDateRange = (start: Date, end: Date) => {
  if (!start || !end) return ''

  const startStr = start.toLocaleDateString('fr-FR')
  const endDate = new Date(end.getTime() - 24 * 60 * 60 * 1000) // Soustraire 1 jour
  const endStr = endDate.toLocaleDateString('fr-FR')

  return `${startStr} - ${endStr}`
}

const calculateNights = (start: Date, end: Date) => {
  if (!start || !end) return 0

  const timeDiff = end.getTime() - start.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1 // Soustraire 1 car FullCalendar ajoute 1 jour
}

const showNotification = (message: string, type: 'success' | 'error') => {
  dragNotification.value = { message, type }
  setTimeout(() => {
    dragNotification.value = null
  }, 5000)
}

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
  console.log('selectInfo', selectInfo.startStr)
  eventStartDate.value = selectInfo.startStr
  eventEndDate.value = selectInfo.endStr || selectInfo.startStr
  openModal()
}

const handleEventClick = (clickInfo: any) => {
  const event = clickInfo.event
  selectedEvent.value = event
  window.open(`/reservation_details/${event.extendedProps.id}`, '_blank')
}

const handleAddOrUpdateEvent = () => {
  if (selectedEvent.value) {
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
    calendarEvents.value = calendarEvents.value.filter(
      (event: any) => event.id !== selectedEvent.value.id,
    )
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
    checkin: 'bg-purple-500 text-white',
    default: 'bg-gray-500 text-white',
  }

  const colorClass = bgColorMap[calendarType] || bgColorMap.default

  return {
    html: `
      <div class="w-full truncate h-full text-sm font-semibold px-2 py-1 rounded-lg shadow-md ${colorClass} flex flex-wrap items-center justify-center cursor-move">
        ${title}
      </div>
    `,
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

  // Nouvelles options pour le glisser-déposer
  editable: true, // Permet le glisser-déposer et le redimensionnement
  eventDrop: handleEventDrop, // Gère le glisser-déposer
  eventResize: handleEventResize, // Gère le redimensionnement (pour prolonger/raccourcir)
  eventStartEditable: true, // Permet de modifier la date de début
  eventDurationEditable: true, // Permet de modifier la durée

  customButtons: {
    addEventButton: {
      text: t('AddEvent+'),
      click: openModal,
    },
  },
  height: 'auto',
  datesSet: handleDateClick,
  dayMaxEventRows: true,
  views: {
    dayGridMonth: {
      dayMaxEventRows: 6,
    },
  },
  eventDidMount: (info: any) => {
    // Tooltip amélioré avec info de glissement
    tippy(info.el, {
      content: `
       <div class="tooltip-content text-sm leading-relaxed text-white">
        <div class="mb-1 font-semibold text-base text-purple-600">${info.event.title} (${info.event.extendedProps.status})</div>
        <div class="mb-2 text-xs text-gray-300">💡 ${t('tooltip.info')}</div>

        <div><strong>📧 ${t('tooltip.email')}  :</strong> ${info.event.extendedProps.email}</div>
        <div><strong>🚪 ${t('tooltip.room')}:</strong> ${info.event.extendedProps.room}</div>
        <div><strong>👤 ${t('tooltip.reservationType')} :</strong> ${info.event.extendedProps.reservationType}</div>
        <div><strong>🛬 ${t('tooltip.arrival')} :</strong> ${ formatDateT(info.event.start) || ''}</div>
        <div><strong>🛫 ${t('tooltip.departure')} :</strong> ${info.event.end?.toISOString().split('T')[0] || ''}</div>

        ${
          info.event.extendedProps.comment
            ? `<div><strong>📝 ${t('tooltip.comment')} :</strong> ${info.event.extendedProps.comment}</div>`
            : ''
        }
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
  const comment = info.event.extendedProps.comment || 'no comment'
  tippy(info.el, {
    content: comment,
    placement: 'top',
    theme: 'light-border',
    arrow: true,
    delay: [100, 0],
  })
}

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

<style scoped>
/* Styles pour améliorer l'expérience de glissement */
.fc-event {
  cursor: move !important;
}

.fc-event:hover {
  opacity: 0.8;
  transform: scale(1.02);
  transition: all 0.2s ease-in-out;
}

.fc-event-dragging {
  opacity: 0.6;
  z-index: 1000;
}

.fc-event-resizing {
  opacity: 0.8;
}

/* Indicateurs visuels pour les coins redimensionnables */
.fc-event-resizer {
  display: block !important;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
}

.fc-event-resizer-start {
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: w-resize;
}

.fc-event-resizer-end {
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: e-resize;
}
</style>
