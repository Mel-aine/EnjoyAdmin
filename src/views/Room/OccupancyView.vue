<template>
  <AdminLayout>
    <section class="p-8 bg-gradient-to-br from-white via-purple-50 to-white min-h-screen rounded-lg">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-tech text-purple-500">{{ $t('OccupancyofRooms') }}</h1>

        <!-- Status Filter -->
        <div class="flex items-center space-x-4">
          <select
            v-model="statusFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">{{ $t('Allstatuses') }}</option>
            <option value="available">{{ $t('Available') }}</option>
            <option value="booked">{{ $t('Booked') }}</option>
            <option value="occupied">{{ $t('Occupied') }}</option>
            <option value="checkout">{{ $t('Release') }}</option>
            <option value="cleaning">{{ $t('Cleaning') }}</option>
            <option value="maintenance">{{ $t('Maintenance') }}</option>
          </select>

          <!-- Stats Summary -->
          <div class="flex items-center space-x-4 text-sm">
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-emerald-600 rounded-full"></div>
              <span>{{ roomStats.available }} {{ $t('Availables') }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-rose-600 rounded-full"></div>
              <span>{{ roomStats.occupied }} {{ $t('Occupied') }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>{{ roomStats.booked }} {{ $t('Booked') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RoomCard
          v-for="room in filteredRooms"
          :key="room.id"
          :room="room"
          @change=" handleStatusChange"
          @checkin="handleCheckIn(room)"
          @checkout="handleCheckOut(room)"
          @cleaned=handleMarkCleaned(room)
        />
      </div>

      <!-- No rooms message -->
      <!-- <div v-if="filteredRooms.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">{{ $t('no room') }}</p>
      </div> -->
    </section>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { ref, computed, onMounted } from 'vue'
import RoomCard from './RoomCard.vue'
import { useServiceStore } from '@/composables/serviceStore';
import { getServiceProductWithOptions } from "@/services/api";
import { checkInReservation, checkOutReservation, getRoomReservations,setAvailable  } from "@/services/reservation";

// State variables
const serviceProducts = ref<any[]>([]);
const serviceStore = useServiceStore();
const statusFilter = ref('');
const loading = ref(false);
const error = ref('');


const fetchServiceProduct = async () => {
  loading.value = true;
  error.value = '';

  try {
    const serviceId = serviceStore.serviceId;
    const response = await getServiceProductWithOptions(serviceId);
    const serviceProductsData = response.data;
    console.log("@@@@@",response.data)

    if (Array.isArray(serviceProductsData)) {
      console.log('response.data est un tableau');

      // Enrichir chaque produit avec ses réservations
      const serviceProductWithOptions = await Promise.all(
        serviceProductsData.map(async (product: any) => {
          const associatedOptions = product.options?.filter((option: any) =>
            option.serviceProductId === product.id
          ) || [];

          let reservations: any[] = [];

          try {
                const response = await getRoomReservations(product.id);
                console.log('Réservations brutes:', response);
                reservations = response
                console.log('Réservations extraites:', reservations);
                } catch (error) {
                console.warn(`Erreur lors de la récupération des réservations pour ${product.id}:`, error);
                }


                let nextAvailable = null;

                if (reservations.length > 0) {
                  const sortedReservations = reservations
                    .filter(r => r.reservation?.departDate)
                    .sort((a, b) => new Date(b.reservation.departDate).getTime() - new Date(a.reservation.departDate).getTime());

                  nextAvailable = sortedReservations[0]?.reservation?.departDate || null;
                }



          return {
            ...product,
            options: associatedOptions,
            reservations: reservations,
            nextAvailable ,
            status: product.status || 'available'
          };
        })
      );

      serviceProducts.value = serviceProductWithOptions;
    } else {
      console.error("response.data n'est pas un tableau.");
      console.log(response.data);
    }

    console.log("Service Products avec options et réservations:", serviceProducts.value);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des produits:', error);
    error.value = 'Erreur lors du chargement des chambres';
  } finally {
    loading.value = false;
  }
};


onMounted(async () => {
  try {
    await fetchServiceProduct();
    console.log('Chambres disponibles :', filteredRooms.value)
  } catch (e) {
    console.error("Erreur lors du fetch des produits:", e);
  }
});


// Flatten service products for display
const flattenServiceProducts = computed(() => {
  const products = serviceProducts.value.length > 0 ? serviceProducts.value : [];
  console.log("@@@@@4444",products)

  return products.map((product: any) => {
    const flatProduct: any = {
      ...product,
    };

    // Ajouter les options si elles existent
    product.options?.forEach((option: any) => {
      const key = `option_${option.optionId}`;
      flatProduct[key] = option.value;
    });

    return flatProduct;
  });
});

// Filtered rooms based on status
const filteredRooms = computed(() => {
  if (!statusFilter.value) {
    return flattenServiceProducts.value;
  }
  return flattenServiceProducts.value.filter((room: any) => room.status === statusFilter.value);
});

// Room statistics
const roomStats = computed(() => {
  const stats = {
    available: 0,
    booked: 0,
    occupied: 0,
    maintenance: 0,
    cleaning: 0,
    checkout: 0,
    total: flattenServiceProducts.value.length
  };

  flattenServiceProducts.value.forEach((room: any) => {
    if (stats.hasOwnProperty(room.status)) {
      stats[room.status as keyof typeof stats]++;
    }
  });

  return stats;
});

// Handle status changes
const handleStatusChange = ({ room, status }:any) => {
  const roomToUpdate = serviceProducts.value.find((r:any) => r.id === room.id)

  if (roomToUpdate) {
    roomToUpdate.status = status

    // Programmation retour à 'available' après 30 minutes si nettoyage
    if (status === 'cleaning') {
      setTimeout(() => {
        if (roomToUpdate.status === 'cleaning') {
          roomToUpdate.status = 'available'
        }
      }, 1800000)
    }

    // Nettoyage des données client si maintenance
    if (status === 'maintenance') {
      delete roomToUpdate.guestName
      delete roomToUpdate.checkInTime
      delete roomToUpdate.checkOutTime
      delete roomToUpdate.nextAvailable
    }

    console.log(`Chambre ${room.name || room.productName} - Nouveau statut: ${status}`)
  }
}


// Handle check-in
const handleCheckIn = async (room: any) => {
  try {
    console.log(`[handleCheckIn] Début du check-in pour la chambre:`, room.name || room.productName);
    console.log('[handleCheckIn] Réservations rechargées depuis l’API:', room.reservations);
    // Trouver la réservation confirmée
    const confirmedReservation = room.reservations?.find((res: any) => res.reservation.status === 'confirmed');
    console.log(`[handleCheckIn] Réservation confirmée trouvée:`, confirmedReservation);

    let guestName = '';
    if (confirmedReservation) {
      guestName = confirmedReservation.creator.firstName;
      console.log(`[handleCheckIn] Nom du client trouvé dans la réservation:`, guestName);

      try {
        console.log(`[handleCheckIn] Appel API checkInReservation avec l'ID:`, confirmedReservation.reservationId);
        await checkInReservation(confirmedReservation.reservationId);

        // Mise à jour réactive locale : remplacer l’élément dans room.reservations
        const index = room.reservations.findIndex((res: any) => res.id === confirmedReservation.id);
        if (index !== -1) {
          room.reservations[index] = { ...confirmedReservation, status: 'checked-in' };
          console.log('[handleCheckIn] Statut réservation local mis à jour en checked_in');
        }

        // Recharger les réservations depuis l'API pour être sûr d'avoir les données à jour
        room.reservations = await getRoomReservations(room.id);
        console.log('[handleCheckIn] Réservations rechargées depuis l’API:', room.reservations);

      } catch (apiError) {
        console.error('[handleCheckIn] Erreur API check-in:', apiError);
      }
    } else {
      guestName = prompt('Nom du client:') || '';
      console.log(`[handleCheckIn] Nom client saisi manuellement:`, guestName);
      if (!guestName) {
        console.log(`[handleCheckIn] Aucun nom client saisi, annulation du check-in.`);
        return;
      }
    }

    // Trouver la chambre dans le store réactif
    const roomToUpdate = serviceProducts.value.find(r => r.id === room.id);
    console.log(`[handleCheckIn] Chambre trouvée dans serviceProducts:`, roomToUpdate);

    if (roomToUpdate) {
      roomToUpdate.status = 'booking';
      roomToUpdate.guestName = guestName;
      roomToUpdate.checkInTime = new Date().toISOString();
      console.log(`[handleCheckIn] Mise à jour de la chambre :`, {
        status: roomToUpdate.status,
        guestName: roomToUpdate.guestName,
        checkInTime: roomToUpdate.checkInTime,
      });

      const checkoutDateInput = prompt('Date/heure de départ prévue (YYYY-MM-DDTHH:mm:ss):');
      console.log(`[handleCheckIn] Date/heure de départ prévue saisie:`, checkoutDateInput);
      // if (checkoutDateInput) {
      //   roomToUpdate.nextAvailable = checkoutDateInput;
      //   console.log(`[handleCheckIn] Mise à jour de la date de disponibilité suivante:`, roomToUpdate.nextAvailable);
      // }
    } else {
      console.warn(`[handleCheckIn] Chambre non trouvée dans serviceProducts pour l'ID:`, room.id);
    }

  } catch (error) {
    console.error("[handleCheckIn] Erreur lors du check-in :", error);
    alert("Erreur lors du check-in. Veuillez réessayer.");
  }
};




// Handle check-out
const handleCheckOut = async (room: any) => {
  try {
    console.log(`Début du check-out pour la chambre : ${room.name || room.productName} (ID: ${room.id})`);

    // Vérification des réservations en cours sur cette chambre
    if (!room.reservations) {
      console.log("Aucune réservation trouvée pour cette chambre.");
    } else {
      console.log(`Nombre de réservations associées à cette chambre : ${room.reservations.length}`);
    }

    const checkedInReservation = room.reservations?.find(
      (res: any) => res.reservation.status === 'checked-in'
    );

    if (!checkedInReservation) {
      console.log("Aucune réservation en cours (status 'checked-in') trouvée.");
    } else {
      console.log(`Réservation en cours trouvée : ID ${checkedInReservation.reservationId}, status ${checkedInReservation.reservation.status}`);
    }

    if (checkedInReservation) {
      try {
        console.log(`Appel à l'API pour check-out de la réservation ID ${checkedInReservation.reservationId}...`);
        await checkOutReservation(checkedInReservation.reservationId);
        checkedInReservation.reservation.status = 'checked-out';
        console.log("Check-out de la réservation effectué avec succès.");
      } catch (apiError) {
        console.error('Erreur API lors du check-out de la réservation:', apiError);
      }
    }

    // Recherche de la chambre à mettre à jour dans la liste globale
    const roomToUpdate = serviceProducts.value.find(r => r.id === Number(room.id));
    if (!roomToUpdate) {
      console.warn(`La chambre avec l'ID ${room.id} n'a pas été trouvée dans serviceProducts.`);
      return;
    }
    console.log("Chambre trouvée dans serviceProducts :", roomToUpdate);

    // Mise à jour du statut et de l'heure de check-out
    roomToUpdate.status = 'checked-out';
    roomToUpdate.checkOutTime = new Date().toISOString();
    console.log(`Statut chambre mis à jour à 'checked-out' avec checkOutTime = ${roomToUpdate.checkOutTime}`);

    // Timer pour passage automatique au statut nettoyage
    setTimeout(() => {
      if (roomToUpdate.status === 'checked-out') {
        roomToUpdate.status = 'cleaning';
        console.log(`Statut chambre changé automatiquement à 'cleaning' après 1 minute.`);
        // Suppression des données de l'ancien client
        delete roomToUpdate.guestName;
        delete roomToUpdate.checkInTime;
        delete roomToUpdate.checkOutTime;
        delete roomToUpdate.nextAvailable;
        console.log("Données client nettoyées de la chambre.");
      } else {
        console.log(`Le statut de la chambre n'était plus 'checked-out' au moment du timeout, statut actuel : ${roomToUpdate.status}`);
      }
    }, 60000); // 1 minute

  } catch (error) {
    console.error("Erreur générale lors du check-out :", error);
    alert("Erreur lors du check-out. Veuillez réessayer.");
  }
};


const handleMarkCleaned = async (room: any) => {
  const roomToUpdate = serviceProducts.value.find(r => r.id === room.id);

  if (roomToUpdate && roomToUpdate.status === 'cleaning') {
    const result = await setAvailable(roomToUpdate.id);

    if (result) {
      roomToUpdate.status = 'available';

    }
  }
}



</script>

<style scoped>
.font-tech {
  font-family: 'Orbitron', 'Rajdhani', 'Michroma', sans-serif;
}
</style>
