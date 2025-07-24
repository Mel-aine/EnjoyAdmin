import { useAuthStore } from '@/composables/user';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;
const authStore = useAuthStore();


const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authStore.token}`
  },
  withCredentials: true
});

export default apiClient;
