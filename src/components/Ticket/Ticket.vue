<script setup lang="ts">
import { computed } from 'vue';

  const props = defineProps(['createdDate', 'code', 'plates', 'status', 'styled']);
  const price = computed(() => {

    return props.plates ? props.plates.reduce((sum: any, item: any) => (sum + (item.Price * item.Quantity)), 0).toFixed(2) : 0;
  })
</script>
<template>
  <div :class="styled && 'bg-white rounded-lg shadow-lg px-8 py-10 max-w-xl mx-auto'">
    <div class="text-slate-700 flex flex-row w-full py-0.5">
      <h2 class="font-bold">{{ $t('Date') }}:&nbsp;&nbsp;</h2>{{ createdDate }}
    </div>
    <div class="text-slate-700 flex flex-row w-full py-0.5">
      <h2 class="font-bold">{{ $t('Ticket') }} #:&nbsp;&nbsp;</h2>{{ code }}
    </div>
    <div class="border-b-2 border-slate-300 pb-4 mb-1 flex py-0.5">
      <!-- <h2 class="font-bold">Bill To:&nbsp;&nbsp;</h2>Table 2 -->
    </div>


    <table class="w-full text-left mb-5 ">
      <thead>
        <tr>
          <th class="text-slate-700 font-bold uppercase py-2">{{ $t('plat') }}</th>
          <th class="text-slate-700 font-bold uppercase py-2">{{ $t('Qte') }}</th>
          <th class="text-slate-700 font-bold uppercase py-2">{{ $t('price') }}</th>
          <th class="text-slate-700 font-bold uppercase py-2 flex justify-end">{{ $t('Total') }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="plate in plates" :key="plate.Code">
          <tr class="hover:bg-slate-50">
            <td class="py-1.5 text-slate-700">{{ plate.Plat.Title }}</td>
            <td class="py-1.5 text-slate-700">{{ plate.Quantity }}</td>
            <td class="py-1.5 text-slate-700">${{ plate.Price }}</td>
            <td class="py-1.5 text-slate-700 flex justify-end">${{ plate.Price * plate.Quantity}}</td>
          </tr>
        </template>
      </tbody>
    </table>

    <div class="flex justify-end mb-3 text-purple-600 font-bold uppercase">
      <div class="text-slate-700 mr-2 ">{{ $t('Total') }}:</div>
      <div class="">${{ price }}</div>
    </div>
    <div>
      <div>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
