<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Input from '@/components/forms/FormElements/Input.vue'
import CustomerSarch from './CustomerSarch.vue'
import { getUser, getReservation } from '@/services/api'
import { useServiceStore } from '@/composables/serviceStore'
import { defineEmits } from 'vue'

const props = defineProps({
  customer_id: String,
})
const emit = defineEmits(['customerSelected'])
const customers = ref<any[]>([])
const users = ref<any[]>([])
const serviceStore = useServiceStore()
const selectedCustomer = ref<any>({})


const selectCustomer = (customer: any) => {
  selectedCustomer.value = { ...customer }
  emit('customerSelected', selectedCustomer.value)
}

const fetchUsers = async () => {
  try {
    const response = await getUser()
    users.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const fetchReservation = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getReservation(serviceId)
    customers.value = response.data.map((res: any) => {
      const user = users.value.find((u: any) => u.id === res.userId)
      return {
        ...res,
        ...user,
        userFullName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',
      }
    })
  } catch (error) {
    console.error('Failed to fetch reservations:', error)
  }
}

onMounted(async () => {
  await fetchUsers()
  await fetchReservation()
})
</script>

<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <CustomerSarch @customer-selected="selectCustomer" />
      <Input :lb="$t('LastName')" v-model="selectedCustomer.lastName" />
      <Input
        :lb="$t('Phone')"
        v-model="selectedCustomer.phoneNumber"
        inputType="tel"

      />
      <Input :lb="$t('Email')" v-model="selectedCustomer.email" />
    </div>
  </div>
</template>

<style></style>
