<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- En-tête modernisé -->
    <div class="px-4 py-3 md:px-6 md:py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <h3 class="text-base md:text-lg font-semibold text-gray-900 flex items-center">
            <slot name="icon">
              <Calendar class="w-5 h-5 mr-2 text-blue-600" />
            </slot>
            <span class="truncate">{{ title }}</span>
          </h3>
        </div>
        <div class="flex items-center space-x-1">
          <button @click="previousMonth" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" aria-label="Mois précédent">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <!-- Affichage du mois stylisé -->
          <div class="text-sm md:text-base font-semibold text-gray-700 text-center w-32 capitalize">
            {{ currentMonthDisplay }}
          </div>
          <button @click="nextMonth" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" aria-label="Mois suivant">
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Grille du calendrier -->
    <div class="p-2 md:p-4">
      <!-- Jours de la semaine -->
      <div class="grid grid-cols-7 mb-2">
        <div v-for="day in daysOfWeek" :key="day" class="text-center text-xs font-medium text-gray-400 py-2">
          {{ $t ? $t(`days_short.${day.toLowerCase()}`) : day }}
        </div>
      </div>

      <!-- Cases du calendrier -->
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'aspect-square p-1.5 border rounded-lg relative transition-colors duration-150 group',
            {
              'bg-white text-gray-800 hover:bg-gray-50': day.isCurrentMonth,
              'bg-gray-50 text-gray-400 hover:bg-gray-100': !day.isCurrentMonth,
              'font-bold text-white bg-blue-600 border-blue-600 hover:bg-blue-700': day.isToday,
              'cursor-pointer': true
            },
            getDayModifiers(day) // Classes personnalisées du parent
          ]"
          @click="onDayClick(day)"
        >
          <!-- Numéro du jour -->
          <span :class="['absolute top-1.5 right-1.5 text-xs', { 'text-white': day.isToday }]">
            {{ day.date.getDate() }}
          </span>

          <!-- Slot pour le contenu personnalisé -->
          <div class="h-full w-full flex flex-col justify-end">
            <slot name="day-content" :day="day" />
          </div>
        </div>
      </div>

      <!-- Légende (si fournie) -->
      <div v-if="$slots.legend" class="mt-4">
        <slot name="legend" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()


export interface CalendarEvent {
  date: Date | string;
  [key: string]: any;
}

// On définit ce qu'est un "jour" du calendrier, qui contient une liste d'événements typés.
export interface CalendarDay {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
  [key: string]: any;
}

// On utilise ces types dans les props. Fini le `any[]` !
interface Props {
  title: string;
  initialDate?: Date;
  events?: CalendarEvent[];
  dayModifiers?: (day: CalendarDay) => string;
}

const props = withDefaults(defineProps<Props>(), {
  initialDate: () => new Date(),
  events: () => [],
  dayModifiers: () => () => ''
});

const emit = defineEmits<{
  (e: 'month-changed', date: Date): void
  (e: 'day-click', day: CalendarDay): void
}>()

// --- Traduction des jours ---
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const currentDate = ref(new Date(props.initialDate));

const currentMonthDisplay = computed(() => {
  return currentDate.value.toLocaleDateString(locale.value, {
    month: 'long',
    year: 'numeric',
  });
});

// --- Calcul des jours ---
const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: CalendarDay[] = [];

  // Jours du mois précédent
  const startDayOfWeek = firstDayOfMonth.getDay();
  for (let i = startDayOfWeek; i > 0; i--) {
    const date = new Date(firstDayOfMonth);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    days.push(createDayObject(date, today, month));
  }

  // Jours du mois actuel
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(year, month, i);
    date.setHours(0, 0, 0, 0);
    days.push(createDayObject(date, today, month));
  }

  // Jours du mois suivant
  const endDayOfWeek = lastDayOfMonth.getDay();
  for (let i = 1; i < 7 - endDayOfWeek; i++) {
    const date = new Date(lastDayOfMonth);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    days.push(createDayObject(date, today, month));
  }

  return days;
});

// Helper pour créer un objet jour et y attacher les événements
function createDayObject(date: Date, today: Date, currentMonth: number): CalendarDay {
  const dateString = date.toDateString();
  return {
    date,
    isToday: date.getTime() === today.getTime(),
    isCurrentMonth: date.getMonth() === currentMonth,
    events: props.events.filter(event =>
      new Date(event.date).toDateString() === dateString
    )
  };
}

// ---  ---
const previousMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1);
  currentDate.value = new Date(currentDate.value);
  emit('month-changed', currentDate.value);
}

const nextMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1);
  currentDate.value = new Date(currentDate.value);
  emit('month-changed', currentDate.value);
}

const onDayClick = (day: CalendarDay) => {
  emit('day-click', day);
}

const getDayModifiers = (day: CalendarDay) => {
  return props.dayModifiers ? props.dayModifiers(day) : '';
}

watch(() => props.initialDate, (newDate) => {
  if (newDate) {
    currentDate.value = new Date(newDate);
  }
});
</script>
