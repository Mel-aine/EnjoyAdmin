<template>
  <div class="w-full">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-2 mb-2">
      <!-- Undo/Redo -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('undo')" title="Undo">↶</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('redo')" title="Redo">↷</button>

      <!-- Formatting -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('bold')" title="Bold"><span class="font-bold">B</span></button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('italic')" title="Italic"><span class="italic">I</span></button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('underline')" title="Underline"><span class="underline">U</span></button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('strikeThrough')" title="Strikethrough"><span class="line-through">S</span></button>

      <!-- Headings -->
      <select class="px-2 py-1 text-xs border rounded" @change="applyHeading($event)">
        <option value="P">Paragraph</option>
        <option value="H1">H1</option>
        <option value="H2">H2</option>
        <option value="H3">H3</option>
        <option value="BLOCKQUOTE">Quote</option>
        <option value="PRE">Code</option>
      </select>

      <!-- Lists -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('insertUnorderedList')" title="Bullet List">• List</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('insertOrderedList')" title="Numbered List">1. List</button>

      <!-- Alignment -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('justifyLeft')" title="Align Left">⟸</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('justifyCenter')" title="Align Center">≡</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('justifyRight')" title="Align Right">⟹</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('justifyFull')" title="Justify">≣</button>

      <!-- Links/Media -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="createLink" title="Insert Link">Link</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="insertImagePrompt" title="Insert Image">Image</button>

      <!-- Misc -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="exec('insertHorizontalRule')" title="Horizontal Rule">HR</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10" @click.prevent="removeFormat" title="Clear Formatting">Clear</button>
    </div>

    <div
      ref="editorRef"
      class="min-h-[120px] w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-dark-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none"
      contenteditable="true"
      :placeholder="placeholder"
      @input="onInput"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const editorRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = props.modelValue || ''
  }
})

watch(() => props.modelValue, (val) => {
  if (editorRef.value && editorRef.value.innerHTML !== (val || '')) {
    editorRef.value.innerHTML = val || ''
  }
})

const onInput = () => {
  emit('update:modelValue', editorRef.value?.innerHTML || '')
}

const exec = (command: string) => {
  document.execCommand(command, false)
}

const removeFormat = () => {
  document.execCommand('removeFormat', false)
}

const createLink = () => {
  const url = prompt('Enter URL')
  if (url) {
    document.execCommand('createLink', false, url)
  }
}

const applyHeading = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value
  document.execCommand('formatBlock', false, value)
}

const insertImagePrompt = () => {
  const url = prompt('Enter image URL')
  if (url) {
    document.execCommand('insertImage', false, url)
  }
}
</script>

<style scoped>
[contenteditable][placeholder]:empty:before {
  content: attr(placeholder);
  color: #9ca3af; /* gray-400 */
}
</style>