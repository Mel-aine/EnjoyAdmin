<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
    <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- En-tête du calendrier -->
      <div class="bg-blue-600 to-blue-800 p-6 text-white text-center rounded-t-xl">
        <h1 class="text-3xl font-bold mb-2">{{ calendarTitle }}</h1>
        <p class="text-lg">{{ calendarSubtitle || currentMonth }}</p>
      </div>

      <!-- Contrôles et vue du calendrier -->
      <div class="p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <CalendarIcon class="w-5 h-5 mr-2 text-blue-600" />
            {{ $t('calendar.title') }}
          </h3>
          <div class="flex items-center space-x-4">
            <!-- Sélecteur de mode d'affichage -->
            <div class="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                @click="calendarViewMode = 'room'"
                :class="['px-3 py-1 rounded-md text-sm font-medium transition-colors',
                         calendarViewMode === 'room' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200']"
              >
                {{ $t('calendar.viewModeRoom') }}
              </button>
              <button
                @click="calendarViewMode = 'staff'"
                :class="['px-3 py-1 rounded-md text-sm font-medium transition-colors',
                         calendarViewMode === 'staff' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200']"
              >
                {{ $t('calendar.viewModeStaff') }}
              </button>
              <button
                @click="calendarViewMode = 'combined'"
                :class="['px-3 py-1 rounded-md text-sm font-medium transition-colors',
                         calendarViewMode === 'combined' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200']"
              >
                {{ $t('calendar.viewModeCombined') }}
              </button>
            </div>

            <!-- Navigation par mois -->
            <button
              @click="previousMonth"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
            </button>
            <button
              @click="nextMonth"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div class="grid grid-cols-7 gap-1 mb-4">
          <div
            v-for="day in daysOfWeek"
            :key="day"
            class="p-3 text-center text-sm font-medium text-gray-500"
          >
            {{ $t(day) }}
          </div>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            :class="[
              'aspect-square p-2 text-sm border rounded-lg relative cursor-pointer transition-all duration-200 overflow-hidden',
              day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
              day.isToday ? 'bg-blue-100 border-blue-300 font-bold' : 'border-gray-200',
              // Appliquer les couleurs de fond en fonction de la présence d'événements et du mode d'affichage
              (calendarViewMode === 'room' || calendarViewMode === 'combined') && day.isReserved && !day.isMaintenance ? 'bg-red-50 border-red-300' : '',
              (calendarViewMode === 'room' || calendarViewMode === 'combined') && day.isMaintenance ? 'bg-yellow-50 border-yellow-300' : '',
              (calendarViewMode === 'staff' || calendarViewMode === 'combined') && day.hasStaffSchedule && !(day.isReserved || day.isMaintenance) ? 'bg-green-50 border-green-300' : '', // Personnel uniquement, si pas de chambre/maintenance
              !day.isReserved && !day.isMaintenance && !day.hasStaffSchedule ? 'hover:bg-gray-50' : '', // Disponible
            ]"
          >
            <div class="font-medium">{{ day.day }}</div>

            <!-- Indicateur de réservation de chambre -->
            <div
              v-if="(calendarViewMode === 'room' || calendarViewMode === 'combined') && day.isReserved && !day.isMaintenance"
              class="absolute bottom-1 left-1 right-1"
            >
              <div class="h-1 bg-red-500 rounded-full mb-1"></div>
              <div class="text-xs text-red-600 font-medium truncate">
                {{ day.reservation?.guest }}
              </div>
            </div>

            <!-- Indicateur de maintenance de chambre -->
            <div v-if="(calendarViewMode === 'room' || calendarViewMode === 'combined') && day.isMaintenance" class="absolute bottom-1 left-1 right-1">
              <div class="h-1 bg-yellow-500 rounded-full mb-1"></div>
              <div class="text-xs text-yellow-600 font-medium truncate">
                {{ $t('maintenance') }}
              </div>
            </div>

            <!-- Indicateur de planning du personnel -->
            <div
              v-if="(calendarViewMode === 'staff' || calendarViewMode === 'combined') && day.hasStaffSchedule"
              class="absolute bottom-1 left-1 right-1"
            >
              <div class="h-1 bg-green-500 rounded-full mb-1"></div>
              <div class="text-xs text-green-600 font-medium truncate">
                {{ day.staffSchedules && day.staffSchedules.length > 0 ? day.staffSchedules[0].employeeName : '' }}
                <span v-if="day.staffSchedules && day.staffSchedules.length > 1"> +{{ day.staffSchedules.length - 1 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Légende -->
        <div class="mt-6 flex flex-wrap items-center justify-center space-x-4 space-y-2">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
            <span class="text-sm text-gray-600">{{ $t('calendar.legend.now') }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-red-50 border border-red-300 rounded mr-2"></div>
            <span class="text-sm text-gray-600">{{ $t('calendar.legend.booked') }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-yellow-50 border border-yellow-300 rounded mr-2"></div>
            <span class="text-sm text-gray-600">{{ $t('calendar.legend.maintenance') }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-green-50 border border-green-300 rounded mr-2"></div>
            <span class="text-sm text-gray-600">{{ $t('calendar.legend.staffSchedule') }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2"></div>
            <span class="text-sm text-gray-600">{{ $t('calendar.legend.available') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Calendar as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

// Définitions des types
interface Reservation {
  id: number;
  checkIn: string; // Chaîne de date ISO
  checkOut: string; // Chaîne de date ISO
  guest: string;
  status: string;
}

interface RoomMaintenance {
  startDate: string; // Chaîne de date ISO
  endDate: string;   // Chaîne de date ISO
}

interface StaffSchedule {
  id: number;
  employeeId: number;
  employeeName: string;
  startDate: string; // Chaîne de date ISO
  endDate: string;   // Chaîne de date ISO
  type: 'Work' | 'Leave' | 'Training'; // Type de planning
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isReserved: boolean;
  reservation?: Reservation;
  isMaintenance: boolean;
  hasStaffSchedule: boolean;
  staffSchedules?: StaffSchedule[];
}

// Définition des props pour le composant réutilisable
const props = defineProps<{
  roomReservations?: Reservation[];
  roomMaintenance?: RoomMaintenance | null;
  allStaffSchedules?: StaffSchedule[];
  calendarTitle?: string;
  calendarSubtitle?: string;
  initialViewMode?: 'room' | 'staff' | 'combined';
}>();

const { t, locale } = useI18n();

const currentDate = ref<Date>(new Date());
const calendarViewMode = ref<'room' | 'staff' | 'combined'>(props.initialViewMode || 'room');

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const currentMonth = computed(() => {
  return currentDate.value.toLocaleDateString(locale.value, {
    month: 'long',
    year: 'numeric',
  });
});

const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay()); // Ajuster pour commencer le dimanche de la première semaine

  const days: CalendarDay[] = [];
  const today = normalizeDate(new Date());

  for (let i = 0; i < 42; i++) { // 6 semaines * 7 jours
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const normalizedCurrentDay = normalizeDate(date);

    // Vérification des réservations de chambre
    const isReserved = props.roomReservations?.some((reservation: Reservation) => {
      const checkIn = normalizeDate(new Date(reservation.checkIn));
      const checkOut = normalizeDate(new Date(reservation.checkOut));
      return normalizedCurrentDay >= checkIn && normalizedCurrentDay <= checkOut;
    }) || false;

    const reservationDetails = isReserved
      ? props.roomReservations?.find((r: Reservation) => {
          const checkIn = normalizeDate(new Date(r.checkIn));
          const checkOut = normalizeDate(new Date(r.checkOut));
          return normalizedCurrentDay >= checkIn && normalizedCurrentDay <= checkOut;
        })
      : undefined;

    // Vérification de la maintenance de la chambre
    const maintenance = props.roomMaintenance;
    const isMaintenance =
      (maintenance &&
        normalizedCurrentDay >= normalizeDate(new Date(maintenance.startDate)) &&
        normalizedCurrentDay <= normalizeDate(new Date(maintenance.endDate))) || false;

    // Vérification du planning du personnel
    const relevantStaffSchedules = (props.allStaffSchedules || []).filter(schedule => {
      const scheduleStart = normalizeDate(new Date(schedule.startDate));
      const scheduleEnd = normalizeDate(new Date(schedule.endDate));
      return normalizedCurrentDay >= scheduleStart && normalizedCurrentDay <= scheduleEnd;
    });
    const hasStaffSchedule = relevantStaffSchedules.length > 0;

    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: normalizedCurrentDay.getTime() === today.getTime(),
      isReserved,
      reservation: reservationDetails,
      isMaintenance,
      hasStaffSchedule,
      staffSchedules: relevantStaffSchedules
    });
  }
  return days;
});

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};
</script>

<style scoped>
/* Tailwind CSS est géré via le CDN dans index.html ou via PostCSS dans un projet Vue réel */
/* Assurez-vous que la police 'Inter' est disponible ou importez-la */
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>
