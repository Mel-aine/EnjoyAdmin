<script setup lang="ts">
import { ref } from 'vue';
import RightSideModal from '@/components/modal/RightSideModal.vue';

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleModalOpen = () => {
  console.log('Modal opened');
};

const saveData = () => {
  console.log('Data saved');
  closeModal();
};
</script>

<template>
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Right Side Modal Demo</h1>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Modal Component Demo</h2>
        <p class="text-gray-600 mb-6">
          This demo showcases a full-screen right-side modal component with slot content and footer.
          The modal slides in from the right side of the screen with smooth animations.
        </p>
        
        <button
          @click="openModal"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Open Right Side Modal
        </button>
      </div>
    </div>

    <!-- Right Side Modal -->
    <RightSideModal
      :isOpen="isModalOpen"
      title="Sample Modal Title"
      @close="closeModal"
      @open="handleModalOpen"
    >
      <!-- Main content slot -->
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-3">Modal Content</h3>
          <p class="text-gray-600 mb-4">
            This is the main content area of the modal. You can put any content here using the default slot.
          </p>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-2">Form Example</h4>
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your message"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-blue-800">Information</h4>
              <p class="text-sm text-blue-700 mt-1">
                This modal supports scrollable content when the content exceeds the viewport height.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer slot -->
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="closeModal"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveData"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </template>
    </RightSideModal>
  </div>
</template>