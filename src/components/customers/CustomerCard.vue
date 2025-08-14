<script setup lang="ts">
import { onMounted, ref, watch,computed } from 'vue'
import Input from '@/components/forms/FormElements/Input.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import InputPhone from '@/components/forms/FormElements/InputPhone.vue'
import CustomerSarch from './CustomerSarch.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { getCustomer } from '@/services/reservation'
import { useServiceStore } from '@/composables/serviceStore'
import { defineEmits } from 'vue'
import { isEqual } from 'lodash'
import { useI18n } from 'vue-i18n'


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
const { t } = useI18n()
 const GuestTitles = computed(()=>[
    { label: t('guestTitles.mr'), value: 'Mr' },
    { label: t('guestTitles.mrs'), value: 'Mrs' },
    { label: t('guestTitles.ms'), value: 'Ms' },
  ])


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
  selectedCustomer.value.phoneNumber = customer.phonePrimary ?? selectedCustomer.value.phonePrimary;
  emit('customerSelected', selectedCustomer.value)
}


const fetchGuest = async () => {
  try {
    const hotelId = serviceStore.serviceId
    const response = await getCustomer(hotelId!)
    console.log("fetchGuest",response)
    customers.value = response.map((guest: any) => {
      return {
        ...guest,
        userFullName: guest ? `${guest.firstName} ${guest.lastName}` : 'Inconnu',
      }
    })
  } catch (error) {
    console.error('Failed to fetch reservations:', error)
  }
}

onMounted(() => {
  fetchGuest()


})

console.log("modalevalue", props.modelValue)
</script>

<template>
<div class="flex md:flex-row flex-col gap-2 mt-4">
  <div class="w-32">
    <Select :lb="$t('Title')" :options="GuestTitles" v-model="selectedCustomer.title" :default-value="$t('guestTitles.mr')" />
  </div>
  <div class="flex-grow">
    <CustomerSarch @customer-selected="selectCustomer" v-model="selectedCustomer" />
  </div>

  <Input :lb="$t('LastName')" v-model="selectedCustomer.lastName" />
  <InputPhone :title="$t('Phone')" v-model="selectedCustomer.phoneNumber" :id="'phone'" :is-required="false" />
  <InputEmail v-model="selectedCustomer.email" placeholder="info@gmail.com" :title="$t('Email')" required />

  <Input v-if="customerType === 'Corporate'" :lb="$t('Company Name')" v-model="selectedCustomer.companyName" required />
  <Input v-if="customerType === 'Group'" :lb="$t('Group Name')" v-model="selectedCustomer.groupName" required />
</div>


</template>

<style></style>
