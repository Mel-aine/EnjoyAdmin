<template>
    <div>
        <main class="flex-grow container mx-auto p-4 md:p-8">
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 class="text-xl font-semibold mb-4 text-gray-700">1. Sélectionnez les Catégories</h2>
                <div class="flex flex-wrap gap-2 overflow-x-auto pb-2">
                    <button @click="selectCategory(null)"
                        :class="{ 'category-button': true, 'active': selectedCategory === null, 'bg-gray-200 text-gray-700 hover:bg-gray-300': selectedCategory !== null }"
                        class="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap">
                        Toutes
                    </button>
                    <button v-for="category in categories" :key="category.id" @click="selectCategory(category.id)"
                        :class="{ 'category-button': true, 'active': selectedCategory === category.id, 'bg-gray-200 text-gray-700 hover:bg-gray-300': selectedCategory !== category.id }"
                        class="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap">
                        {{ category.name }}
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-xl font-semibold mb-4 text-gray-700">2. Choisissez les Commodités</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                        <div v-for="amenity in filteredAmenities" :key="amenity.id"
                            class="amenity-card flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div class="flex items-center">
                                <i :class="['bi', amenity.icon, 'text-lg', 'mr-3', 'text-teal-600']"></i>
                                <div>
                                    <p class="font-medium text-gray-800">{{ amenity.name }}</p>
                                    <p v-if="amenity.price > 0" class="text-sm text-gray-500">{{
                                        formatPrice(amenity.price) }}</p>
                                    <p v-else class="text-sm text-gray-500">Gratuit</p>
                                </div>
                            </div>
                            <button @click="toggleAmenity(amenity)"
                                :class="{ 'bg-teal-500 text-white hover:bg-teal-600': !isSelected(amenity.id), 'bg-red-500 text-white hover:bg-red-600': isSelected(amenity.id) }"
                                class="px-3 py-1 rounded-md text-sm transition-colors duration-200">
                                {{ isSelected(amenity.id) ? 'Retirer' : 'Ajouter' }}
                            </button>
                        </div>
                        <p v-if="filteredAmenities.length === 0 && selectedCategory !== null"
                            class="text-gray-500 text-center col-span-full">
                            Aucune commodité disponible pour cette catégorie.
                        </p>
                    </div>

                    <div class="mt-6 pt-4 border-t border-gray-200">
                        <button @click="showCustomAmenityForm = !showCustomAmenityForm"
                            class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center">
                            <i class="bi bi-plus-circle mr-2"></i> Ajouter une commodité personnalisée
                        </button>
                        <div v-if="showCustomAmenityForm" class="mt-4 p-4 bg-blue-50 rounded-lg">
                            <h3 class="font-semibold text-blue-800 mb-3">Nouvelle Commodité</h3>
                            <input type="text" v-model="customAmenityName" placeholder="Nom de la commodité"
                                class="w-full p-2 border border-blue-200 rounded-md mb-2 focus:ring-blue-500 focus:border-blue-500">
                            <input type="number" v-model.number="customAmenityPrice" placeholder="Prix (facultatif)"
                                class="w-full p-2 border border-blue-200 rounded-md mb-3 focus:ring-blue-500 focus:border-blue-500">
                            <button @click="addCustomAmenity" :disabled="!customAmenityName.trim()"
                                class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50">
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-xl font-semibold mb-4 text-gray-700">3. Commodités Sélectionnées</h2>
                    <div class="max-h-96 overflow-y-auto pr-2">
                        <div v-if="selectedAmenities.length === 0" class="text-gray-500 text-center py-4">
                            Aucune commodité sélectionnée pour l'instant.
                        </div>
                        <table v-else class="min-w-full table-auto border-collapse">
                            <thead>
                                <tr class="table-header text-gray-700 text-sm uppercase font-semibold">
                                    <th class="py-2 px-4 text-left">Nom</th>
                                    <th class="py-2 px-4 text-right">Prix</th>
                                    <th class="py-2 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="amenity in selectedAmenities" :key="amenity.id"
                                    class="border-b border-gray-200 hover:bg-gray-50">
                                    <td class="py-2 px-4 flex items-center">
                                        <i :class="['bi', amenity.icon, 'text-lg', 'mr-2', 'text-teal-700']"
                                            v-if="amenity.icon"></i>
                                        <p class="font-medium text-gray-800">{{ amenity.name }}</p>
                                    </td>
                                    <td class="py-2 px-4 text-right">
                                        <input type="number" v-model.number="amenity.price"
                                            @input="updateAmenityPrice(amenity.id, $event.target.value)"
                                            class="price-input p-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
                                        <span class="text-sm text-gray-600">XAF</span>
                                    </td>
                                    <td class="py-2 px-4 text-center">
                                        <button @click="removeSelectedAmenity(amenity.id)"
                                            class="text-red-500 hover:text-red-700 p-1 rounded-full">
                                            <i class="bi bi-x-circle text-lg"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-gray-800">Coût Total Estimé :</h3>
                        <span class="text-2xl font-extrabold text-teal-700">{{ formatPrice(totalPrice) }}</span>
                    </div>
                    <button @click="saveAmenities" :disabled="selectedAmenities.length === 0"
                        class="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center">
                        <i class="bi bi-save mr-2"></i> Enregistrer les Commodités
                    </button>
                </div>
            </div>

            <!-- Nouvelle Section : Commodités Enregistrées de l'Hôtel -->
            <section v-if="savedHotelAmenities.length > 0" class="mt-8 bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-700">4. Commodités Enregistrées de l'Hôtel</h2>
                <div class="max-h-96 overflow-y-auto pr-2">
                    <table class="min-w-full table-auto border-collapse">
                        <thead>
                            <tr class="table-header text-gray-700 text-sm uppercase font-semibold">
                                <th class="py-2 px-4 text-left">Nom</th>
                                <th class="py-2 px-4 text-right">Prix</th>
                                <th class="py-2 px-4 text-center">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="amenity in savedHotelAmenities" :key="amenity.id"
                                class="border-b border-gray-200 hover:bg-gray-50">
                                <td class="py-2 px-4 flex items-center">
                                    <i :class="['bi', amenity.icon, 'text-lg', 'mr-2', 'text-teal-700']"
                                        v-if="amenity.icon"></i>
                                    <p class="font-medium text-gray-800">{{ amenity.name }}</p>
                                </td>
                                <td class="py-2 px-4 text-right">
                                    <span class="text-gray-800">{{ formatPrice(amenity.price) }}</span>
                                </td>
                                <td class="py-2 px-4 text-center">
                                    <span
                                        :class="{ 'bg-blue-100 text-blue-800': amenity.custom, 'bg-gray-100 text-gray-700': !amenity.custom }"
                                        class="px-2 py-1 rounded-full text-xs font-semibold">
                                        {{ amenity.custom ? 'Personnalisée' : 'Standard' }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>


    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';

const categories = ref([
    { id: "CAT001", name: "Services Généraux", description: "Services opérationnels de base" },
    { id: "CAT002", name: "Restauration & Bar", description: "Services de nourriture et boissons" },
    { id: "CAT003", name: "Bien-être & Loisirs", description: "Installations de fitness, relaxation et loisirs" },
    { id: "CAT004", name: "Affaires", description: "Installations et services pour voyageurs d'affaires" },
    { id: "CAT005", name: "Mobilité", description: "Services de transport et de stationnement" },
    { id: "CAT006", name: "Services Pratiques", description: "Services de support et de commodité additionnels" },
    { id: "CAT007", "name": "Famille & Enfants", description: "Commodités spécifiques pour enfants et familles" },
    { id: "CAT008", name: "Animaux de Compagnie", description: "Hébergements et services liés aux animaux" }
]);

const hotelAmenities = ref([
    { id: "HTL001", name: "Réception 24h/24", category_id: "CAT001", description: "Personnel de réception disponible à tout moment", available: true, price: 0, icon: "bi-clock" },
    { id: "HTL002", name: "Service de conciergerie", category_id: "CAT001", description: "Assistance personnalisée pour les services aux clients", available: true, price: 0, icon: "bi-person-badge" },
    { id: "HTL004", name: "Restaurant sur place", category_id: "CAT002", description: "Restauration à l'hôtel avec menu complet", available: true, price: 0, icon: "bi-egg-fried" },
    { id: "HTL005", name: "Petit-déjeuner buffet", category_id: "CAT002", description: "Petit-déjeuner illimité servi sous forme de buffet", available: true, price: 5000, icon: "bi-cup-straw" },
    { id: "HTL006", name: "Service en chambre", category_id: "CAT002", description: "Repas et boissons livrés dans les chambres", available: true, price: 2500, icon: "bi-door-open" },
    { id: "HTL007", name: "Piscine", category_id: "CAT003", description: "Piscine extérieure ou intérieure pour les clients", available: true, price: 0, icon: "bi-droplet-half" },
    { id: "HTL008", name: "Centre de fitness", category_id: "CAT003", description: "Salle de sport avec équipement d'entraînement", available: true, price: 0, icon: "bi-heart-pulse" },
    { id: "HTL009", name: "Spa et sauna", category_id: "CAT003", description: "Zone de relaxation avec options de vapeur et de massage", available: false, price: 8000, icon: "bi-fire" },
    { id: "HTL011", name: "Salles de réunion", category_id: "CAT004", description: "Espaces pour réunions d'affaires ou événements", available: true, price: 15000, icon: "bi-people" },
    { id: "HTL012", name: "Wi-Fi dans les espaces publics", category_id: "CAT004", description: "Accès Internet dans le hall et les espaces partagés", available: true, price: 0, icon: "bi-wifi" },
    { id: "HTL013", name: "Parking gratuit", category_id: "CAT005", description: "Stationnement sécurisé sur place", available: true, price: 0, icon: "bi-car-front" },
    { id: "HTL014", name: "Navette aéroport", category_id: "CAT005", description: "Transport entre l'hôtel et l'aéroport", available: true, price: 7000, icon: "bi-bus-front" },
    { id: "HTL015", name: "Service de blanchisserie", category_id: "CAT006", description: "Lavage et repassage des vêtements", available: true, price: 3000, icon: "bi-basket" },
    { id: "HTL018", name: "Aire de jeux", category_id: "CAT007", description: "Zone de jeux extérieure pour enfants", available: true, price: 0, icon: "bi-emoji-smile" },
    { id: "HTL020", name: "Animaux acceptés", category_id: "CAT008", description: "Animaux de compagnie autorisés avec hébergement", available: true, price: 5000, icon: "bi-paw" }
]);

const selectedCategory = ref(null); // null means "All" categories
const selectedAmenities = ref<any[]>([]); // Array of { id, name, price, icon (optional), custom (boolean) }
const savedHotelAmenities = ref<any[]>([]); // New: List of amenities saved for the hotel

const customAmenityName = ref('');
const customAmenityPrice = ref(0);
const showCustomAmenityForm = ref(false);

// Filter amenities based on selected category
const filteredAmenities = computed(() => {
    if (selectedCategory.value === null) {
        return hotelAmenities.value;
    }
    return hotelAmenities.value.filter(
        amenity => amenity.category_id === selectedCategory.value
    );
});

// Calculate total price of selected amenities
const totalPrice = computed(() => {
    return selectedAmenities.value.reduce((sum, amenity) => sum + (amenity.price || 0), 0);
});

// Check if an amenity is already selected
const isSelected = (amenityId : string) => {
    return selectedAmenities.value.some(item => item.id === amenityId);
};

// Select a category
const selectCategory = (categoryId : string) => {
    selectedCategory.value = categoryId;
};

// Add or remove an amenity from selected list
const toggleAmenity = (amenity:any) => {
    const index = selectedAmenities.value.findIndex(item => item.id === amenity.id);
    if (index > -1) {
        // Amenity is already selected, remove it
        selectedAmenities.value.splice(index, 1);
    } else {
        // Amenity not selected, add it
        selectedAmenities.value.push({
            id: amenity.id,
            name: amenity.name,
            price: amenity.price,
            icon: amenity.icon,
            custom: false // Not a custom amenity
        });
    }
};

// Update price of a selected amenity
const updateAmenityPrice = (amenityId, newPrice) => {
    const amenity = selectedAmenities.value.find(item => item.id === amenityId);
    if (amenity) {
        amenity.price = parseFloat(newPrice) || 0; // Ensure it's a number
    }
};

// Add a custom amenity
const addCustomAmenity = () => {
    if (customAmenityName.value.trim()) {
        const newId = `CUSTOM_${Date.now()}`; // Unique ID for custom amenity
        selectedAmenities.value.push({
            id: newId,
            name: customAmenityName.value.trim(),
            price: parseFloat(customAmenityPrice.value) || 0,
            icon: 'bi-gem', // Default icon for custom amenities
            custom: true
        });
        customAmenityName.value = '';
        customAmenityPrice.value = 0;
        showCustomAmenityForm.value = false; // Hide form after adding
    }
};

// Remove a selected amenity
const removeSelectedAmenity = (amenityId:string) => {
    selectedAmenities.value = selectedAmenities.value.filter(item => item.id !== amenityId);
};

// Save selected amenities to the hotel's saved list
const saveAmenities = () => {
    // Deep copy selected amenities to saved list
    savedHotelAmenities.value = JSON.parse(JSON.stringify(selectedAmenities.value));
    alert('Commodités enregistrées avec succès !'); // Replace with a custom modal for better UX
};

// Format price for display
const formatPrice = (price:number) => {
    return new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0, // No decimals for XAF
        maximumFractionDigits: 0
    }).format(price);
};
</script>

<style>
body {
    font-family: 'Inter', sans-serif;
    background-color: #f8fafc;
    color: #2d3748;
}

.category-button.active {
    background-color: #0d9488;
    color: white;
}

.amenity-card {
    transition: transform 0.2s ease-in-out;
}

.amenity-card:hover {
    transform: translateY(-2px);
}

.price-input {
    width: 80px;
    text-align: right;
}

/* Fixed width and right alignment for price input */
.table-header {
    background-color: #f1f5f9;
}

/* slate-100 */
</style>
