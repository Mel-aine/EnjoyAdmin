<template>
  <div>
    <div class="grid grid-cols-3 gap-4 mb-2 px-4 font-semibold text-gray-500">
      <div>Plat</div>
      <div class="text-center">Commandes</div>
      <div class="text-right">Revenu</div>
    </div>
    <div v-for="(dish, index) in dishes" :key="dish.name"
         :class="{'bg-gray-50': index % 2 === 0}"
         class="grid grid-cols-3 gap-4 p-4 rounded">
      <div class="font-medium">{{ dish.name }}</div>
      <div class="text-center">{{ dish.orders }}</div>
      <div class="text-right font-semibold">{{ dish.revenue }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  dishes: Array
})
</script>
