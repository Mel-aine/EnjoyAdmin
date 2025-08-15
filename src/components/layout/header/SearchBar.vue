<template>
  <div class="hidden lg:block">
    <SearchBarComponent 
      :placeholder="$t('Searchortypecommand')"
      @select="handleReservationSelect"
      class="w-80"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SearchBarComponent from '@/components/common/SearchBar.vue'
import type { ReservationDetails } from '@/utils/models'

const router = useRouter()

const handleReservationSelect = (reservation: ReservationDetails) => {
  // Navigate to reservation details or perform desired action
  console.log('Selected reservation:', reservation)
  // Example: router.push(`/reservations/${reservation.id}`)
}
</script>
