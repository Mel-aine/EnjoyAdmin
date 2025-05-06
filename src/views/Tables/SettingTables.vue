<template>
  <div class="flex flex-col md:flex-row gap-4 mb-0">
    <!-- Liste des onglets -->
    <div class="md:w-[20%] w-full">
      <ul class="flex md:flex-col flex-row justify-between md:space-y-2 space-x-2  md:space-x-0 list-none">
        <li
          v-for="(tab, index) in tabs"
          :key="index"
        >
          <a
            class="text-md font-sans font-medium flex items-center gap-2 leading-normal cursor-pointer px-4 py-2 rounded-lg text-center w-full flex-wrap"
            @click="selectTab(index + 1)"
            :class="{
              'bg-white text-gray-950 dark:text-white dark:bg-gray-950': openTab !== index + 1,
              'bg-purple-100 text-purple-500': openTab === index + 1
            }"
          >
            <component v-if="tab.icon" :is="tab.icon" class="w-5 h-5" />
            {{ tab.label }}
          </a>
        </li>
      </ul>
    </div>

    <!-- Contenu des onglets -->
    <div class="md:w-[80%] w-full border border-gray-200 rounded-lg pt-6 px-4 md:px-8">
      <slot :tab="tabs[openTab - 1]"></slot>
    </div>
  </div>
</template>



<script setup>
import { ref } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['tab-selected']);
const openTab = ref(1);

// Fonction pour sélectionner un onglet
const selectTab = (tabIndex) => {
  openTab.value = tabIndex;
  emit('tab-selected', tabIndex); // Émet un événement lorsque l'onglet est sélectionné
};
</script>

<style scoped>
/* Ajouter des styles pour espacer les onglets et aligner les contenus */
</style>
