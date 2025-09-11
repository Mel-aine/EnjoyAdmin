<template>

<form class="grid grid-cols-1 xl:grid-cols-1 gap-6 p-6" >
  <p><br> <b>Tax Operation</b></p><br>
    <div  class="flex  justify-end">
    <input
      type="text"
      placeholder="Search..."
      class="w-48 p-2 rounded text-sm border border-white placeholder-white bg-blue-500 text-white"
    />
  </div>
  <div class="barre flex flex-row space-x-3">
     <div>
         <div class="w-75">
            <InputDoubleDatePicker
              :title="$t('DateRange')"
              :allowPastDates="false"
              :is-required="true"
              @clear-error="clearDateRangeError()"/>
          </div>
          
      </div>
    <div class="w-50">
          <Select :lb="$t('ApplyTaxOn')" 
          :options="billToOptions"/>
    </div>
  </div>   
<table class=" border-collapse border-spacing-0 w-full text-sm p-0 m-0  ">
  <tr class="bg-green-100 h-15 leading-none text-sm p-2 border border-spacing-0   ">
    <td><input type="checkbox" id="1" value="1" v-model="checkedNames"/>
      <label for=""></label></td>
    <td><b>Date</b></td>  
    <td><b>Particular</b></td>
    <td><b>Description</b></td>
    <td><b>User</b></td>
    <td><b>Amount</b></td>
  </tr>
  <tr class="bg-red-100 h-15 leading-none text-sm p-0 m-0 border border-spacing-0  ">
    <td><input type="checkbox" id="2" value="2" v-model="checkedNames"/>
      <label for=""></label></td>
     <td>31/07/2022</td> 
    <td>Room Charges</td>
    <td></td>
    <td>helpdesksupport</td>
    <td>2.500.00</td>
  </tr>
  <tr class="bg-blue-100 h-15 leading-none text-sm p-2 border border-spacing-0 ">
    <td><input type="checkbox" id="3" value="3" v-model="checkedNames"/>
      <label for=""></label></td>
    <td><s>31/07/2022</s></td>  
    <td><s>ST@ 10%</s></td>
    <td><s>Tax exempted</s></td>
    <td><s>helpdesksupport</s></td>
    <td><s>2.500.00</s></td>
  </tr>
</table>

<div><b>Taxes</b><br>
  <div class="space-x-2">
    <input type="radio" id="Assign" value="Assign" v-model="selected "/>
      <label for="Assign">Assign</label>

    <input type="radio" id="Exempt" value="Exempt" v-model="selected" />
      <label for="Exempt">Exempt</label>
  </div>
</div>

<div class="space-x-2">
  <input type="checkbox" id="All" value="All" v-model="checkAll"/>
 <label for="All">All</label><br><br>
  <div class="grid grid-cols-5" >
    <div v-for="ts in taxes" :key='ts.value' class="space-x-2">
      <input type="checkbox" class="option" :value="ts.value" v-model="checkedNames" />
      <label :for="ts.value">{{ ts.label }}</label>
    </div>
  </div>
   <!-- <div>
    <td><input type="checkbox" class="option" value="Green tax" v-model="checkedNames" />
      <label for="Green tax">Green tax</label></td>
    <td><input type="checkbox" class="option" value="heritage tax" v-model="checkedNames" />
      <label for="heritage tax">heritage tax</label></td>
    <td><input type="checkbox" class="option" value="VAT" v-model="checkedNames" />
      <label for="VAT">VAT</label></td>
    <td><input type="checkbox" class="option" value="Adult tax" v-model="checkedNames" />
      <label for="Adult tax">Adult tax</label></td>
    <td><input type="checkbox" class="option" value="Child Tax" v-model="checkedNames" />
      <label for="Child Tax">Child Tax</label></td>
    </div>
  <div>
    <td><input type="checkbox" class="option" value="VAT@6%" v-model="checkedNames" />
      <label for="VAT@6%">VAT@6%</label></td>
    <td><input type="checkbox" class="option" value="SGST 5%" v-model="checkedNames" />
      <label for="SGST 5%">SGST 5%"</label></td>
    <td><input type="checkbox" class="option" value="CGST 5%" v-model="checkedNames" />
      <label for="CGST 5%">CGST 5%"</label></td>
    
    </div>-->
</div>
 <div class="mt-auto flex justify-end">
    <!-- Ton contenu de formulaire ici -->

    <button type="submit" class="bg-blue-600 text-white px-4 py-4 rounded">
        Apply
    </button>
  </div>

</form>
  
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import {computed } from 'vue';
import InputDoubleDatePicker from '@/components/forms/FormElements/InputDoubleDatePicker.vue';
import Select from '@/components/forms/FormElements/Select.vue'
interface option {
  label: string,
  value: any
}
const checkedNames = ref<any>([])
const selected = ref('')
const search = ref('')
const items = ref([])
const checkAll = ref(false)
const billToOptions = computed(() => [
  { label: ('Room Charges'), value: 'Room Charges' },
  { label: ('Individual'), value: 'individual' },
  { label: ('Agent'), value: 'agent' }
])
const taxes = ref([
  {
    label:'SGST',
    value:"SGST"
  },
   {
    label:'CGST',
    value:"CGST"
  },
   {
    label:'ST@10%',
    value:"ST@10%"
  },
   {
    label:'Tax',
    value:"Tax"
  },
   {
    label:'Tax01',
    value:"Tax01"
  },
  
   {
    label:'Green tax',
    value:"Green tax"
  },
   {
    label:'heritage tax',
    value:"heritage tax"
  },
   {
    label:'VAT',
    value:"VAT"
  },
   {
    label:'Adult tax',
    value:"Adult tax"
  },
  {
    label:'Child Tax',
    value:"Child Tax"
  },
   {
    label:'VAT @ 6%',
    value:"VAT @ 6%"
  },
   {
    label:'SGST 5%',
    value:"SGST 5%"
  },
  
  {
    label:'CGST 5%',
    value:"CGST 5%"
  },
  
  


])
const filteredItems = computed(() =>
  items.value.filter(item =>
    item.toLowerCase().includes(search.value.toLowerCase())
  )
)
// checkedNames.value = [
//   { label: 'All', value:false},
// { label: 'SGST', value:false},
// { label: 'CGST', value:false},
// { label: 'ST@10%',value:false},
// { label: 'Tax',value:false},
// { label: 'Tax01',value:false},
// { label: 'Green Tax',value:false},
// { label: 'heritage Tax',value:false},
// { label: 'VAT',value:false},
// { label: 'Adult tax',value:false},
// { label: 'Child tax',value:false},
// { label: 'VAT@6%',value:false},
// { label: 'SGST 5%',value:false},
// { label: 'CGST 5%',value:false},]
const startDate = ref('')
const endDate = ref('')

watch(()=>checkAll.value,(value)=>{
console.log(value)
if(value){
  checkedNames.value=['SGST','CGST',
'ST@10%',
'Tax',
'Tax01','Green tax','heritage tax','VAT','Adult tax','Child Tax','VAT @ 6%','SGST 5%','CGST 5%']
}else{
  checkedNames.value=[]
}
})

const clearDateRangeError = () => {
  // Clear l'erreur de validation pour les dates
  
}



</script>
<style scoped>

.search {
  position: absolute;
  top: 70px;
  right: 20px;
  padding: 5px 4px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}


.barre { 
  display: flex;
  
}




</style>