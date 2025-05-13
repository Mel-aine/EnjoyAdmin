<script setup lang="ts">
  import { ref, type PropType } from 'vue';

  const props = defineProps({
    label: String,
    type: String,
    placeholder: String,
    customClasses: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [String, Number, File] as PropType<string | number | File>,
    },
    max: Number
  });

  const emit = defineEmits(['update:modelValue']);
  const base64Data = ref<string | null>(null);

  // Cette fonction est appelée lorsque l'utilisateur sélectionne un fichier
  const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;

    // Si le type est "file", on traite le fichier et on l'émet sous forme de base64
    if (target.type === 'file' && target.files) {
      const file = target.files[0];
      if (file) {
        emit("update:modelValue", file);
        // const reader = new FileReader();

        // reader.onload = () => {
        //   base64Data.value = reader.result as string; // On stocke l'image en base64
        //   emit("update:modelValue", base64Data.value); // On émet la valeur en base64
        // };

        // reader.onerror = (error) => {
        //   console.error("File reading error:", error);
        // };

        // reader.readAsDataURL(file); // On lit le fichier en base64
      }
    } else if (target.type !== 'file') {
      // Pour les autres types d'input (textarea, text, etc.), on met à jour le modèle directement
      emit("update:modelValue", target.value);
    }
  };
</script>

<template>
  <div :class="customClasses">
    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400" v-if="label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Gestion du textarea -->
    <template v-if="props.type === 'textarea'">
      <textarea
        :placeholder="placeholder ?? ''"
        :disabled="disabled"
        :value="modelValue"
        @input="updateValue"
        :required="required"
        :maxlength="max"
        class="dark:bg-dark-900 h-20 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
      />
    </template>

    <!-- Gestion de l'input file -->
    <template v-if="props.type === 'file'">
      <input
        type="file"
        :placeholder="placeholder ?? ''"
        :disabled="disabled"
        @change="updateValue"
        :required="required"
        :maxlength="max"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
      />
    </template>

    <!-- Gestion des autres types d'input (text, email, etc.) -->
    <template v-if="props.type !== 'textarea' && props.type !== 'file'">
      <input
        :type="props.type"
        :placeholder="placeholder ?? ''"
        :disabled="disabled"
        :value="modelValue"
        @input="updateValue"
        :required="required"
        :maxlength="max"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
      />
    </template>
  </div>
</template>

<style scoped>
</style>
