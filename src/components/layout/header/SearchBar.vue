<template>
  <div class="hidden lg:block">
    <SearchBarComponent 
      :placeholder="$t('Searchortypecommand')"
    />
  </div>
</template>

<script setup lang="ts">
import SearchBarComponent from '@/components/common/SearchBar.vue'
</script>
