<!-- RoomSelector.vue -->
<template>
  <div class="space-y-6">
    <!-- Room selection section with improved UI -->
    <div v-for="(roomSelection, index) in roomSelections" :key="index" class="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Room Type Selection -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ $t('SelectRoom') }} {{ roomSelections.length > 1 ? `#${index + 1}` : '' }}
          </label>
          <select
            v-model="roomSelection.roomType"
            @change="handleRoomSelection(index)"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
          >
            <option value="" disabled>{{ $t('PleaseSelectRoom') }}</option>
            <option v-for="room in availableRooms" :key="room.id" :value="room.id">
              {{ room.label }} - {{ room.price }} {{ currency }}
            </option>
          </select>
        </div>

        <!-- Arrival Date -->
        <!-- <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ $t('ArrivedDate') }}
          </label>
          <div class="relative">
          <input
            type="date"
            v-model="roomSelection.arrivalDate"
            :placeholder="$t('Selectdate')"
             @change="calculateNights(index)"
             class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"

          />
          <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                  fill=""
                />
              </svg>
          </span>
          </div>
           <div class="relative">
            <flat-pickr
              v-model="roomSelection.arrivalDate"
              :config="flatpickrConfig"
              class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              :placeholder="$t('Selectdate')"
              @on-change="calculateNights(index)"
            />
            <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                  fill=""
                />
              </svg>
            </span>
          </div>
        </div> -->

        <!-- Departure Date
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ $t('DepartDate') }}
          </label>
          <div class="relative">
          <input
            type="date"
            v-model="roomSelection.departureDate"
            :placeholder="$t('Selectdate')"
             @change="calculateNights(index)"
             class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"

          />
          <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                  fill=""
                />
              </svg>
          </span>
          </div>-->
          <!-- <div class="relative">
            <flat-pickr
              v-model="roomSelection.departureDate"
              :config="flatpickrConfig"
              class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              :placeholder="$t('Selectdate')"
              @on-change="calculateNights(index)"
            />
            <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                  fill=""
                />
              </svg>
            </span>
          </div> -->
          <!-- <p v-if="roomSelection.dateError" class="mt-1 text-sm text-red-600">
            {{ roomSelection.dateError }}
          </p>
        </div> -->


      <!-- Additional room details row -->

        <!-- Number of nights (calculated) -->
        <!-- <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ $t('Numberofnights') }}
          </label>
          <input
            type="text"
            :value="roomSelection.numberOfNights || ''"
            readonly
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"

          />
        </div> -->

        <!-- Room occupancy -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ $t('Occupancy') }}
          </label>
          <div class="relative">
            <input
              type="text"
              readonly
              :value="`${roomSelection.adults} ${$t('Adult')}${roomSelection.adults > 1 ? 's' : ''}, ${roomSelection.children} ${$t('Children')}`"
              @click="showOccupancySelector(index)"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"

            />

            <!-- Occupancy selector dropdown -->
            <div v-if="roomSelection.showOccupancyDropdown" class="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4">
              <div class="mb-3">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-700 dark:text-white">{{ $t('Adult') }}(s)</span>
                  <div class="flex items-center gap-2">
                    <button @click.prevent="decrementAdults(index)" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">-</button>
                    <span class="w-6 text-center">{{ roomSelection.adults }}</span>
                    <button @click.prevent="incrementAdults(index)" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">+</button>
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-700 dark:text-white">{{ $t('Children') }}</span>
                  <div class="flex items-center gap-2">
                    <button @click.prevent="decrementChildren(index)" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">-</button>
                    <span class="w-6 text-center">{{ roomSelection.children }}</span>
                    <button @click.prevent="incrementChildren(index)" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">+</button>
                  </div>
                </div>
              </div>

              <button
                @click.prevent="hideOccupancySelector(index)"
                class="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition-colors"
              >
                {{ $t('Validate') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Room price (calculated) -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ $t('RoomPrice') }}
          </label>
          <input
            type="text"
            :value="roomSelection.roomPrice || ''"
            readonly
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"

          />
        </div>
      </div>

      <!-- Remove room button (only visible if there's more than one room) -->
      <div v-if="roomSelections.length > 1" class="mt-4 flex justify-end">
        <button
          @click.prevent="removeRoom(index)"
          class="flex items-center text-red-500 hover:text-red-700 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
          {{ $t('RemoveRoom') }}
        </button>
      </div>
    </div>
  </div>

    <!-- Add another room button -->
    <div class="flex justify-center">
      <button
        @click.prevent="addRoom"
        class="flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
          <path d="M12 5v14"></path>
          <path d="M5 12h14"></path>
        </svg>
        {{ $t('AddAnotherRoom') }}
      </button>
    </div>

    <!-- Total price section -->
    <!-- <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <span class="font-medium text-lg text-gray-900 dark:text-white">{{ $t('TotalPrice') }}</span>
        <span class="font-bold text-xl text-gray-900 dark:text-white">{{ calculateTotalPrice() }} {{ currency }}</span>
      </div>
    </div> -->


</template>

<script>
export default {
  name: 'RoomSelector',
  props: {
    availableRooms: {
      type: Array,
      default: () => [],
    },
    currency: {
      type: String,
      default: 'FCFA'
    },
    initialRoomSelections: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      roomSelections: this.initialRoomSelections.length ? this.initialRoomSelections : [this.createEmptyRoomSelection()],
      flatpickrConfig: {
        dateFormat: 'd/m/Y',
        minDate: 'today',
        mode: 'single',
        enableTime: false
      }

      // flatpickrConfig : {
      //   dateFormat: 'Y-m-d',
      //   altInput: true,
      //   altFormat: 'F j, Y',
      //   wrap: true,
      // }

    };
  },
  methods: {
    createEmptyRoomSelection() {
      return {
        roomType: '',
        arrivalDate: '',
        departureDate: '',
        numberOfNights: null,
        adults: 1,
        children: 0,
        roomPrice: null,
        dateError: '',
        showOccupancyDropdown: false
      };
    },

    addRoom() {
      this.roomSelections.push(this.createEmptyRoomSelection());
      this.$emit('update:roomSelections', this.roomSelections);
    },

    removeRoom(index) {
      if (this.roomSelections.length > 1) {
        this.roomSelections.splice(index, 1);
        this.$emit('update:roomSelections', this.roomSelections);
        this.updateTotalPrice();
      }
    },

    handleRoomSelection(index) {
      const roomId = this.roomSelections[index].roomType;
      const selectedRoom = this.availableRooms.find(room => room.id === roomId);

      if (selectedRoom) {
        this.calculateRoomPrice(index);
      }

      this.$emit('update:roomSelections', this.roomSelections);
    },

    // calculateNights(index) {
    //   const { arrivalDate, departureDate } = this.roomSelections[index];

    //   if (arrivalDate && departureDate) {
    //     const arrival = new Date(arrivalDate);
    //     const departure = new Date(departureDate);

    //     if (departure <= arrival) {
    //       this.roomSelections[index].dateError = this.$t('DepartureDateMustBeAfterArrival');
    //       this.roomSelections[index].numberOfNights = null;
    //     } else {
    //       const timeDifference = departure.getTime() - arrival.getTime();
    //       const nightsDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    //       this.roomSelections[index].numberOfNights = nightsDifference;
    //       this.roomSelections[index].dateError = '';
    //       this.calculateRoomPrice(index);
    //     }
    //   }

    //   this.$emit('update:roomSelections', this.roomSelections);
    // },

    calculateRoomPrice(index) {
      const { roomType } = this.roomSelections[index];

      if (roomType) {
        const selectedRoom = this.availableRooms.find(room => room.id === roomType);

        if (selectedRoom) {
          this.roomSelections[index].roomPrice = selectedRoom.price;
        }
      }

      this.updateTotalPrice();
    },

    calculateTotalPrice() {
      return this.roomSelections.reduce((total, room) => {
        return total + (room.roomPrice || 0);
      }, 0);
    },

    updateTotalPrice() {
      const totalPrice = this.calculateTotalPrice();
      this.$emit('update:totalPrice', totalPrice);
    },

    showOccupancySelector(index) {
      // Close any open dropdowns first
      this.roomSelections.forEach((room, i) => {
        if (i !== index) {
          room.showOccupancyDropdown = false;
        }
      });

      this.roomSelections[index].showOccupancyDropdown = true;
    },

    hideOccupancySelector(index) {
      this.roomSelections[index].showOccupancyDropdown = false;
      this.$emit('update:roomSelections', this.roomSelections);
    },

    incrementAdults(index) {
      const selectedRoom = this.availableRooms.find(room => room.id === this.roomSelections[index].roomType);
      const maxOccupancy = selectedRoom?.maxOccupancy || 4;
      const currentTotal = this.roomSelections[index].adults + this.roomSelections[index].children;

      if (currentTotal < maxOccupancy) {
        this.roomSelections[index].adults++;
      }
    },

    decrementAdults(index) {
      if (this.roomSelections[index].adults > 1) {
        this.roomSelections[index].adults--;
      }
    },

    incrementChildren(index) {
      const selectedRoom = this.availableRooms.find(room => room.id === this.roomSelections[index].roomType);
      const maxOccupancy = selectedRoom?.maxOccupancy || 4;
      const currentTotal = this.roomSelections[index].adults + this.roomSelections[index].children;

      if (currentTotal < maxOccupancy) {
        this.roomSelections[index].children++;
      }
    },

    decrementChildren(index) {
      if (this.roomSelections[index].children > 0) {
        this.roomSelections[index].children--;
      }
    }
  },
  watch: {
    roomSelections: {
      deep: true,
      handler() {
        this.$emit('update:roomSelections', this.roomSelections);
      }
    }
  }
};
</script>
