<template>
  <div class="hidden lg:block">
    <SearchBarComponent 
      :placeholder="$t('Searchortypecommand')"
      @select="onSelect"
    />
  </div>
</template>

<script setup lang="ts">
import SearchBarComponent from '@/components/common/SearchBar.vue'
import type { ReservationDetails } from '@/utils/models'

const emit = defineEmits<{ (e: 'select', reservation: ReservationDetails): void }>()

const onSelect = (reservation: ReservationDetails) => {
  emit('select', reservation)
}
</script>
