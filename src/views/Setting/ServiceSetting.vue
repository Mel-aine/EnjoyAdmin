// HotelParametersManager.vue
<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('managingHotel') }}</h2>

    <!-- Section Informations Générales -->
    <InfoGeneral 
    :cloudinary-config="cloudinaryConfig"
      :max-images="12"
      :max-file-size="10"
      @logo-changed="handleLogoChange"
      @images-changed="handleImagesChange"
      ref="imageUploader"/>

 

    <div class="mb-8">
    <ScheduleManagement/>
    </div>

    <!-- Section Paramètres du Service -->
    <div class="mb-8  max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 class="text-xl font-semibold text-gray-700 mb-4">{{ $t('ServiceSettings') }}</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Input :lb="t('CheckIn')" :id="'checkInTime'" :forLabel="'checkInTime'" :inputType="'time'" v-model="serviceParameters.checkInTime" />

        </div>

        <div>
          <Input :lb="t('CheckOut')" :id="'checkOutTime'" :forLabel="'checkOutTime'" :inputType="'time'" v-model="serviceParameters.checkOutTime" />
        </div>
      </div>

      <div >
        <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('servicesOffered') }}:</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div v-for="(service, index) in availableServices" :key="index" class="flex items-center">
            <input type="checkbox" :id="'service-' + index" v-model="serviceParameters.enabledServices[service.id]"
                   class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label :for="'service-' + index" class="ml-2 text-sm text-gray-700">{{ service.name }}</label>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Paramètres de Tarification -->
    <div class="mb-8  max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 class="text-xl font-semibold text-gray-700 mb-4">{{ $t('pricingSettings') }}</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Select :lb="t('currency')" :options="currencyOptions" v-model="pricingParameters.currency"/>
        </div>

        <div>
          <Input :lb="t('taxRate')" :inputType="'number'" :id="'taxRate'" :forLabel="'taxRate'" v-model.number="pricingParameters.taxRate" step="0.01" min="0"/>
        </div>
      </div>

      <!-- <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Tarifs des Chambres:</label>

        <div v-for="(room, index) in pricingParameters.roomRates" :key="index"
             class="mb-4 border border-gray-200 rounded-md p-4 bg-gray-50">
          <div class="flex justify-between items-center mb-3">
            <span class="font-medium text-gray-800">{{ room.type }}</span>
            <button type="button" @click="removeRoomType(index)"
                    class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm">
              Supprimer
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label :for="'baseRate-' + index" class="block text-sm font-medium text-gray-700 mb-1">Tarif de base:</label>
              <input type="number" :id="'baseRate-' + index" v-model.number="room.baseRate" min="0" step="0.01"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label :for="'weekendRate-' + index" class="block text-sm font-medium text-gray-700 mb-1">Tarif weekend:</label>
              <input type="number" :id="'weekendRate-' + index" v-model.number="room.weekendRate" min="0" step="0.01"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <input type="text" v-model="newRoomType" placeholder="Type de chambre"
                 class="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <button type="button" @click="addRoomType" :disabled="!newRoomType"
                  class="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
            Ajouter
          </button>
        </div>
      </div> -->
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end gap-4">
      <!-- <button type="button" @click="resetParameters"
              class="px-5 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600">
        Réinitialiser
      </button> -->
      <button type="button" @click="updateParameters"
              class="px-5 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600">

        <span v-if="!isLoading">  {{ t('Save') }} </span>
                <span v-else class="flex items-center gap-2">
                  <Spinner class="w-4 h-4" />
                  {{ $t('Processing') }}...
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted,computed } from 'vue';
import {getService,updateService } from '@/services/api'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore';
import { useToast } from 'vue-toastification'
import ScheduleManagement from './ScheduleManagement.vue'
import InfoGeneral from './InfoGeneral.vue';
import CloudinaryImageUpload from './CloudinaryImageUpload.vue'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore();
const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'));
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'));
const FileInput = defineAsyncComponent(()=>import('@/components/forms/FormElements/FileInput.vue'))
const isLoading=ref(false)
interface ServiceParameters {
  checkInTime: string;
  checkOutTime: string;
  enabledServices: Record<string, boolean>;
}


interface PricingParameters {
  currency: string;
  taxRate: number;

}



interface Service {
  id: string;
  name: string;
}



    // const hotelService = new HotelService();

    // État des paramètres de l'hôtel
    const hotelInfo = ref({
      name: '',
      address: '',
      phone: '',
      email: ''
    });

    const serviceParameters = reactive<ServiceParameters>({
      checkInTime: '14:00',
      checkOutTime: '11:00',
      enabledServices: {}
    });

    const pricingParameters = reactive<PricingParameters>({
      currency: 'EUR',
      taxRate: 20,

    });


    const stars = ref([
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' }
    ])



    const availableCurrencies = computed(()=>[
      { code: 'EUR', name: t('currencies.EUR') },
      { code: 'USD', name: t('currencies.USD') },
      { code: 'GBP', name: t('currencies.GBP') },
      { code: 'CHF', name: t('currencies.CHF') },
      { code: 'CAD', name: t('currencies.CAD') }
    ])

    const currencyOptions = computed(()=>availableCurrencies.value.map((curr:any) => ({
      label: curr.name,
      value: curr.code
    })))


    const availableServices: Service[] = [
  { id: 'breakfast', name: t('services.breakfast') },
  { id: 'wifi', name: t('services.wifi') },
  { id: 'parking', name: t('services.parking') },
  { id: 'roomService', name: t('services.roomService') },
  { id: 'spa', name: t('services.spa') },
  { id: 'gym', name: t('services.gym') },
  { id: 'restaurant', name: t('services.restaurant') },
  { id: 'bar', name: t('services.bar') },
  { id: 'pool', name: t('services.pool') },
  { id: 'airport_shuttle', name: t('services.airport_shuttle') }
];


    availableServices.forEach(service => {
      serviceParameters.enabledServices[service.id] = false;
    });

  

// Configuration Cloudinary
const cloudinaryConfig = {
  cloudName: 'your-cloud-name', // Remplacez par votre cloud name
  uploadPreset: 'your-upload-preset', // Remplacez par votre upload preset
  apiKey: 'your-api-key' // Optionnel pour la suppression
}

// Données de l'hôtel
const hotelData = reactive({
  name: '',
  address: '',
  phone: '',
  email: '',
  logo: null as string | null,
  images: [] as any[]
})

// Ref du composant
const imageUploader = ref()

// Handlers
const handleLogoChange = (logoUrl: string | null) => {
  hotelData.logo = logoUrl
  console.log('Logo changed:', logoUrl)
}

const handleImagesChange = (images: any[]) => {
  hotelData.images = images
  console.log('Images changed:', images)
}

// const saveHotelData = async () => {
//   try {
//     // Récupérer les données depuis le composant
//     const logoUrl = imageUploader.value.getLogoUrl()
//     const images = imageUploader.value.getImages()
    
//     const dataToSave = {
//       ...hotelData,
//       logo: logoUrl,
//       images: images
//     }
    
//     // Envoyer à votre API
//     const response = await fetch('/api/hotels', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(dataToSave)
//     })
    
//     if (response.ok) {
//       alert('Hôtel sauvegardé avec succès!')
//     }
//   } catch (error) {
//     console.error('Erreur lors de la sauvegarde:', error)
//     alert('Erreur lors de la sauvegarde')
//   }
// }




    // // const saveParameters = async () => {
    // //   try {
    // //     // Créer un objet combinant tous les paramètres
    // //     const allParameters = {
    // //       hotelInfo,
    // //       serviceParameters,
    // //       pricingParameters
    // //     };

    //     // Appel au service pour sauvegarder
    //    // await hotelService.saveParameters(allParameters);

    //     // Notification de succès (à implémenter selon votre système de notification)
    //     alert('Paramètres enregistrés avec succès!');
    //   } catch (error) {
    //     console.error('Erreur lors de l\'enregistrement des paramètres:', error);
    //     alert('Erreur lors de l\'enregistrement des paramètres');
    //   }
    // };

    // const loadParameters = async () => {
    //   try {
    //    // const params = await hotelService.getParameters();

    //     // Mettre à jour les états réactifs avec les données chargées
    //     if (params.hotelInfo) {
    //       Object.assign(hotelInfo, params.hotelInfo);
    //     }

    //     if (params.serviceParameters) {
    //       // Préserver la structure des services activés
    //       serviceParameters.checkInTime = params.serviceParameters.checkInTime || '14:00';
    //       serviceParameters.checkOutTime = params.serviceParameters.checkOutTime || '11:00';

    //       // Réinitialiser les services puis activer ceux qui sont sauvegardés
    //       availableServices.forEach(service => {
    //         serviceParameters.enabledServices[service.id] =
    //           params.serviceParameters.enabledServices?.[service.id] || false;
    //       });
    //     }

    //     if (params.pricingParameters) {
    //       pricingParameters.currency = params.pricingParameters.currency || 'EUR';
    //       pricingParameters.taxRate = params.pricingParameters.taxRate || 20;
    //       pricingParameters.roomRates = params.pricingParameters.roomRates || [];
    //     }
    //   } catch (error) {
    //     console.error('Erreur lors du chargement des paramètres:', error);
    //     alert('Erreur lors du chargement des paramètres');
    //   }
    // };

    // const resetParameters = () => {
    //   if (confirm('Êtes-vous sûr de vouloir réinitialiser les paramètres?')) {
    //     loadParameters();
    //   }
    // };

    // // Charger les paramètres au montage du composant
    onMounted(async () => {
  const serviceId = serviceStore.serviceId;
  const data = await getService(serviceId);

  // const addressObject = JSON.parse(data.data.address);
  // if (!addressObject.text) {
  //   throw new Error("Objet JSON incomplet");
  // }

  hotelInfo.value = {
    name: data.data.name,
    address: data.data.text,
    phone: data.data.phoneNumber,
    email: data.data.email,
    // location: {
    //   lat: addressObject.lat,
    //   lng: addressObject.lng
     }
});
const updateParameters = async()=> {
  isLoading.value=true
  try {
    const serviceId = serviceStore.serviceId;

    // const payload = {
    //   hotelInfo: hotelInfo.value,
    //   serviceParameters: {
    //     checkInTime: serviceParameters.checkInTime,
    //     checkOutTime: serviceParameters.checkOutTime,
    //     enabledServices: { ...serviceParameters.enabledServices }
    //   },
    //   pricingParameters: {
    //     currency: pricingParameters.currency,
    //     taxRate: pricingParameters.taxRate,
    //     roomRates: pricingParameters.roomRates.map(rate => ({
    //       type: rate.type,
    //       baseRate: rate.baseRate,
    //       weekendRate: rate.weekendRate
    //     }))
    //   }
    // };

    const payload = {
      name : hotelInfo.value.name,
      address : hotelInfo.value.address,
      email : hotelInfo.value.email,
      phone_number : hotelInfo.value.phone
    }


    await updateService(serviceId, payload);


    toast.success(t('toast.SucessUpdate'));
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres :', error);
    toast.error(t('toast.updateError'));
  }finally{
    isLoading.value=false
  }
}




</script>
