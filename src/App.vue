<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import { useI18n } from "vue-i18n";
import { useLanguageStore } from './lang/language';
const useLanguage = useLanguageStore();
const t = useI18n({ useScope: "global" });



if (useLanguage.language) {
  t.locale.value = useLanguage.language;
} else {
  useLanguage.set(t.locale.value)
}
</script>
<style>
@reference "tailwindcss";
</style>
