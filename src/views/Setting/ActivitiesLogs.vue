<!-- App.vue -->
<template>
    <div class="">
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <HistoryIcon class="mr-2 text-blue-600" :size="24" /> {{ $t('activityLog.sectionTitle') }}
                </h2>
                <ul v-if="activityLogs.length > 0" class="space-y-3">
                    <li v-for="log in activityLogs" :key="log.id"
                        class="bg-gray-50 p-4 rounded-md border border-gray-100 shadow-sm">
                        <div class="flex items-center text-sm text-gray-600 mb-1">
                            <ClockIcon :size="16" class="mr-2" />
                            <span>{{ formatDate(log.createdAt) }}</span>
                            <span class="ml-4 flex items-center">
                                <UserIcon :size="16" class="mr-1" /> {{ $t('activityLog.by') }}: <span
                                    class="font-semibold text-gray-800 ml-1">{{ log.username }}</span>
                            </span>
                        </div>
                        <p class="text-gray-800 font-medium">{{ log.description }}</p>
                        <div class="text-xs text-gray-500 mt-1">
                            <span>{{ $t('activityLog.action') }}: <span class="font-semibold">{{ log.action
                                    }}</span></span>
                            <span class="ml-4">{{ $t('activityLog.entityType') }}: <span class="font-semibold">{{
                                    log.entityType }}</span></span>
                            <span class="ml-4">{{ $t('activityLog.entityId') }}: <span class="font-semibold">{{
                                    log.entityId }}</span></span>
                            <span v-if="log.ipAddress" class="ml-4">IP: {{ log.ipAddress }}</span>
                        </div>
                        <div v-if="log.changes" class="mt-2 text-xs text-gray-700 bg-gray-100 p-2 rounded-md">
                            <p class="font-semibold">{{ $t('activityLog.changes') }}:</p>
                            <pre class="whitespace-pre-wrap text-wrap">{{ JSON.stringify(log.changes, null, 2) }}</pre>
                        </div>
                    </li>
                </ul>
                <p v-else class="italic text-gray-600">{{ $t('activityLog.noActivity') }}</p>
            </div>
        </div>
</template>

<script setup lang="ts">
import { Clock as ClockIcon, History as HistoryIcon, User as UserIcon } from 'lucide-vue-next';
import type { ActivityLog } from '@/utils/models';


defineProps<{ activityLogs: ActivityLog[] }>()
// Données d'activité log mockées

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
};
</script>

<style>
/* Tailwind CSS est géré via le CDN dans index.html ou via PostCSS dans un projet Vue réel */
/* Assurez-vous que la police 'Inter' est disponible ou importez-la */
.font-inter {
    font-family: 'Inter', sans-serif;
}
</style>
