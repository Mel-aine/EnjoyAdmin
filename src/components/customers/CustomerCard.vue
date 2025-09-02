<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import Input from '@/components/forms/FormElements/Input.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import InputPhone from '@/components/forms/FormElements/InputPhone.vue'
import CustomerSarch from './CustomerSarch.vue'
import Select from '@/components/forms/FormElements/Select.vue'
// import { getCustomer } from '@/services/guestApi'
import { useServiceStore } from '@/composables/serviceStore'
import { defineEmits } from 'vue'
import { isEqual } from 'lodash'
import { useI18n } from 'vue-i18n'
import { getCustomer } from '../../services/reservation'
import InputCountries from '../forms/FormElements/InputCountries.vue'

const props = defineProps({
  customer_id: String,
  modelValue: Object,
  customerType: {
    type: String,
    default: 'Individual',
  },
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
const GuestTitles = computed(() => [
  { label: t('guestTitles.mr'), value: 'Mr' },
  { label: t('guestTitles.mrs'), value: 'Mrs' },
  { label: t('guestTitles.ms'), value: 'Ms' },
])

watch(
  () => props.modelValue,
  (newVal) => {
    console.log('newVal', newVal)
    if (!isEqual(newVal, selectedCustomer.value)) {
      selectedCustomer.value = { ...newVal }
    }
  },
)

watch(
  selectedCustomer,
  (newVal) => {
    if (!isEqual(newVal, props.modelValue)) {
      emit('update:modelValue', newVal)
    }
  },
  { deep: true },
)

const selectCustomer = (customer: any) => {
  if (!customer) {
    return
  }
  selectedCustomer.value.firstName = customer.firstName ?? selectedCustomer.value.firstName
  selectedCustomer.value.lastName = customer.lastName ?? selectedCustomer.value.lastName
  selectedCustomer.value.email = customer.email ?? selectedCustomer.value.email
  selectedCustomer.value.phoneNumber = customer.phonePrimary ?? selectedCustomer.value.phonePrimary
  selectedCustomer.value.address = customer.addressLine ?? selectedCustomer.value.addressLine
  selectedCustomer.value.country = customer.country ?? selectedCustomer.value.country
  selectedCustomer.value.state = customer.stateProvince ?? selectedCustomer.value.stateProvince
  selectedCustomer.value.city = customer.city ?? selectedCustomer.value.city
  selectedCustomer.value.zipcode = customer.postalCode ?? selectedCustomer.value.postalCode

  emit('customerSelected', selectedCustomer.value)
}

const fetchGuest = async () => {
  try {
    const hotelId = serviceStore.serviceId
    const response = await getCustomer(hotelId!)
    console.log('fetchGuest', response)
    customers.value = response.data.map((guest: any) => {
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

console.log('modalevalue', props.modelValue)
</script>

<template>
 <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
  <div>
    <Select
      :lb="$t('Title')"
      :options="GuestTitles"
      v-model="selectedCustomer.title"
      :default-value="$t('guestTitles.mr')"
    />
  </div>

  <div class="">
    <CustomerSarch @customer-selected="selectCustomer" v-model="selectedCustomer" />
  </div>

  <div>
    <Input :lb="$t('LastName')" v-model="selectedCustomer.lastName" />
  </div>

  <div>
    <InputPhone
      :title="$t('Phone')"
      v-model="selectedCustomer.phoneNumber"
      :id="'phone'"
      :is-required="false"
    />
  </div>

  <div>
    <InputEmail
      v-model="selectedCustomer.email"
      placeholder="info@gmail.com"
      :title="$t('Email')"
      required
    />
  </div>

  <div>
    <Input
      :inputType="'text'"
      :lb="$t('Address')"
      :id="'address'"
      forLabel="'address'"
      v-model="selectedCustomer.address"
    />
  </div>

  <div>
    <InputCountries :lb="'Country'" v-model="selectedCustomer.country" />
  </div>

  <div>
    <Input
      :inputType="'text'"
      :lb="$t('State')"
      :id="'State'"
      forLabel="'State'"
      v-model="selectedCustomer.state"
    />
  </div>

  <div>
    <Input
      :inputType="'text'"
      :lb="$t('City')"
      :id="'city'"
      forLabel="'city'"
      v-model="selectedCustomer.city"
    />
  </div>

  <div>
    <Input
      :inputType="'text'"
      :lb="$t('Zipcode')"
      :id="'zipcode'"
      forLabel="'zipcode'"
      v-model="selectedCustomer.zipcode"
    />
  </div>

  <!-- <div v-if="customerType === 'Corporate'">
    <Input
      :lb="$t('Company Name')"
      v-model="selectedCustomer.companyName"
      required
    />
  </div>

  <div v-if="customerType === 'Group'">
    <Input
      :lb="$t('Group Name')"
      v-model="selectedCustomer.groupName"
      required
    />
  </div> -->
 </div>

</template>

<style></style>
