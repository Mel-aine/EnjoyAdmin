<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Input from '@/components/forms/FormElements/Input.vue'
import CustomerSarch from './CustomerSarch.vue'
import { getUser, getReservation } from '@/services/api'
import { useServiceStore } from '@/composables/serviceStore'
import { defineEmits } from 'vue'
import { isEqual } from 'lodash'

const props = defineProps({
  customer_id: String,
  modelValue: Object,
  customerType: {
    type: String,
    default: 'Individual'
  }
})
const emit = defineEmits<{
  (e: 'customerSelected', payload: any): void
  (e: 'update:modelValue', value: any): void
}>()

const customers = ref<any[]>([])
const users = ref<any[]>([])
const serviceStore = useServiceStore()
const selectedCustomer = ref<any>({ ...props.modelValue })


watch(() => props.modelValue, (newVal) => {
  console.log("newVal", newVal)
  if (!isEqual(newVal, selectedCustomer.value)) {

    selectedCustomer.value = { ...newVal }
  }
})

watch(selectedCustomer, (newVal) => {
  if (!isEqual(newVal, props.modelValue)) {
    emit('update:modelValue', newVal)
  }
}, { deep: true })





const selectCustomer = (customer: any) => {
  if (!customer){
    return
  }
  selectedCustomer.value.firstName = customer.firstName ?? selectedCustomer.value.firstName;
  selectedCustomer.value.lastName = customer.lastName ?? selectedCustomer.value.lastName;
  selectedCustomer.value.email = customer.email ?? selectedCustomer.value.email;
  selectedCustomer.value.phoneNumber = customer.phoneNumber ?? selectedCustomer.value.phoneNumber;
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

onMounted(() => {
  fetchUsers()
  fetchReservation()


})

console.log("modalevalue", props.modelValue)
</script>

<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <CustomerSarch @customer-selected="selectCustomer" v-model="selectedCustomer" />
      <Input :lb="$t('LastName')" v-model="selectedCustomer.lastName" />
      <Input :lb="$t('Phone')" v-model="selectedCustomer.phoneNumber" inputType="tel" />
      <Input :lb="$t('Email')" v-model="selectedCustomer.email" required />
      <Input :lb="$t('Company Name')" v-model="selectedCustomer.companyName" required
        v-if="customerType === 'Corporate'" />
      <Input :lb="$t('Group Name')" v-model="selectedCustomer.groupName" required v-if="customerType === 'Group'" />
    </div>
  </div>
</template>

<style></style>
