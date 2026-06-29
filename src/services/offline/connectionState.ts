/**
 * Module-level reactive state for connection status.
 *
 * Shared between useConnection.ts (which manages event listeners)
 * and ConnectionStatus.vue (which reads the state).
 * This avoids double event listener registration.
 */
import { ref } from 'vue'

export type ConnectionQuality = 'online' | 'unstable' | 'offline'

export const isOnline = ref(navigator.onLine)
export const connectionQuality = ref<ConnectionQuality>(navigator.onLine ? 'online' : 'offline')
export const lastOnlineAt = ref<Date | null>(navigator.onLine ? new Date() : null)
export const lastOfflineAt = ref<Date | null>(navigator.onLine ? null : new Date())
export const pendingOperations = ref(0)
export const isSyncing = ref(false)
