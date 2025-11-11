<template>
  <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">
      {{ pageTitle }}
    </h2>
    <nav>
      <ol class="flex items-center gap-1.5">
        <li v-for="(item, index) in computedBreadcrumbs" :key="index" class="flex items-center gap-1.5">
          <router-link
            v-if="item.href && index < computedBreadcrumbs.length - 1"
            :to="item.href"
            class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
          >
            {{ item.label }}
            <svg
              class="stroke-current"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </router-link>
          <span v-else class="text-sm text-gray-800 dark:text-white/90">
            {{ item.label }}
          </span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Breadcrumb {
  label: string
  href?: string
}

interface BreadcrumbProps {
  pageTitle: string
  breadcrumb?: Breadcrumb[]
}

const props = defineProps<BreadcrumbProps>()

const { t } = useI18n()

const computedBreadcrumbs = computed(() => {
  if (!props.breadcrumb || props.breadcrumb.length === 0) {
    return [
      { label: t('Home'), href: '/front-office/dashboard' },
      { label: props.pageTitle }
    ]
  }
  return [{ label: t('Home'), href: '/front-office/dashboard' }, ...props.breadcrumb]
})
</script>
