
import { ref } from 'vue'
import { getCreditBalance } from '@/services/creditLedger'

// useCreditLedger.ts
export function useGuestCreditBalance() {
  const creditBalance = ref(0)
  const isLoading = ref(false)

  const fetchBalance = async (guestId: number, hotelId: number) => {
    if (!guestId) return
    isLoading.value = true
    try {
      const response = await getCreditBalance(guestId, hotelId)
      const data = response.data
      console.log('Balance fetch response:', data)
      creditBalance.value = Number(data.outstandingCredit || data.balance || 0)
    } catch (err) {
      console.error('Erreur balance:', err)
      creditBalance.value = 0
    } finally {
      isLoading.value = false
    }
  }

  return { creditBalance, isLoading, fetchBalance }
}