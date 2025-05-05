<template>
  <footer class="border-t p-6 text-sm flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-colors duration-300">
    <p class="mb-2 md:mb-0">© 2025 Enjoy. {{ $t('allRightsReserved') }}.</p>

    <div class="flex gap-4">
      <a href="#" class="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{{ $t('legalNotices') }}</a>
      <a href="#" class="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{{ $t('confidentiality') }}</a>
      <a href="#" class="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{{ $t('contact') }}</a>
    </div>
  </footer>
</template>

<script setup lang="ts">



</script>
