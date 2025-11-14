
<template>
    <ConfigurationLayout>
        <FullScreenLayout>
           <StaffDetailsPage v-if="user" :user="user" :is-loading="loading" />
           <div v-else-if="loading" class="flex items-center justify-center min-h-screen">
             <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           </div>
        </FullScreenLayout>
    </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import FullScreenLayout from '../../components/layout/FullScreenLayout.vue';
import ConfigurationLayout from '../Configuration/ConfigurationLayout.vue';
import StaffDetailsPage from './StaffDetailsPage.vue';
import { getUserById } from '@/services/userApi';
import type { userDataType } from '@/types/option';

const route = useRoute();
const toast = useToast();
const { t } = useI18n();

const user = ref<userDataType | null>(null);
const loading = ref(true); // Commencer à true

const fetchUser = async () => {
  loading.value = true;
  try {
    const userId = Number(route.params.id);
    if (!userId) {
      throw new Error('User ID is missing');
    }

    const response = await getUserById(userId);
    user.value = response.data;

  } catch (error) {
    console.error('Failed to fetch user:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUser();
});
</script>
