<template>
  <div class="w-full">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-2 mb-2">
      <!-- Undo/Redo -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" @click.prevent="exec('undo')" :disabled="viewMode !== 'wysiwyg'" title="Undo">↶</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" @click.prevent="exec('redo')" :disabled="viewMode !== 'wysiwyg'" title="Redo">↷</button>

      <!-- Formatting -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" :class="isActive('bold') ? 'bg-gray-100 dark:bg-gray-700' : ''" @click.prevent="exec('bold')" :disabled="viewMode !== 'wysiwyg'" :aria-pressed="isActive('bold')" title="Bold"><span class="font-bold">B</span></button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" :class="isActive('italic') ? 'bg-gray-100 dark:bg-gray-700' : ''" @click.prevent="exec('italic')" :disabled="viewMode !== 'wysiwyg'" :aria-pressed="isActive('italic')" title="Italic"><span class="italic">I</span></button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" :class="isActive('underline') ? 'bg-gray-100 dark:bg-gray-700' : ''" @click.prevent="exec('underline')" :disabled="viewMode !== 'wysiwyg'" :aria-pressed="isActive('underline')" title="Underline"><span class="underline">U</span></button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" :class="isActive('strikeThrough') ? 'bg-gray-100 dark:bg-gray-700' : ''" @click.prevent="exec('strikeThrough')" :disabled="viewMode !== 'wysiwyg'" :aria-pressed="isActive('strikeThrough')" title="Strikethrough"><span class="line-through">S</span></button>

      <!-- Headings -->
      <select class="px-2 py-1 text-xs border rounded disabled:opacity-50" @change="applyHeading($event)" :disabled="viewMode !== 'wysiwyg'">
        <option value="P">Paragraph</option>
        <option value="H1">H1</option>
        <option value="H2">H2</option>
        <option value="H3">H3</option>
        <option value="BLOCKQUOTE">Quote</option>
        <option value="PRE">Code</option>
      </select>

      <!-- Lists -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" :class="isActive('insertUnorderedList') ? 'bg-gray-100 dark:bg-gray-700' : ''" @click.prevent="exec('insertUnorderedList')" :disabled="viewMode !== 'wysiwyg'" :aria-pressed="isActive('insertUnorderedList')" title="Bullet List">• List</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" :class="isActive('insertOrderedList') ? 'bg-gray-100 dark:bg-gray-700' : ''" @click.prevent="exec('insertOrderedList')" :disabled="viewMode !== 'wysiwyg'" :aria-pressed="isActive('insertOrderedList')" title="Numbered List">1. List</button>

      <!-- Alignment -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" :class="isActive('justifyLeft') ? 'bg-gray-100 dark:bg-gray-700' : ''" @click.prevent="exec('justifyLeft')" :disabled="viewMode !== 'wysiwyg'" :aria-pressed="isActive('justifyLeft')" title="Align Left">⟸</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" :class="isActive('justifyCenter') ? 'bg-gray-100 dark:bg-gray-700' : ''" @click.prevent="exec('justifyCenter')" :disabled="viewMode !== 'wysiwyg'" :aria-pressed="isActive('justifyCenter')" title="Align Center">≡</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" :class="isActive('justifyRight') ? 'bg-gray-100 dark:bg-gray-700' : ''" @click.prevent="exec('justifyRight')" :disabled="viewMode !== 'wysiwyg'" :aria-pressed="isActive('justifyRight')" title="Align Right">⟹</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" :class="isActive('justifyFull') ? 'bg-gray-100 dark:bg-gray-700' : ''" @click.prevent="exec('justifyFull')" :disabled="viewMode !== 'wysiwyg'" :aria-pressed="isActive('justifyFull')" title="Justify">≣</button>

      <!-- Links/Media -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" @click.prevent="createLink" :disabled="viewMode !== 'wysiwyg'" title="Insert Link">Link</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" @click.prevent="unlink" :disabled="viewMode !== 'wysiwyg'" title="Remove Link">Unlink</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" @click.prevent="insertImagePrompt" :disabled="viewMode !== 'wysiwyg'" title="Insert Image">Image</button>

      <!-- Misc -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" @click.prevent="exec('insertHorizontalRule')" :disabled="viewMode !== 'wysiwyg'" title="Horizontal Rule">HR</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" @click.prevent="removeFormat" :disabled="viewMode !== 'wysiwyg'" title="Clear Formatting">Clear</button>

      <!-- Indent/Outdent -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" @click.prevent="exec('indent')" :disabled="viewMode !== 'wysiwyg'" title="Indent">→ Indent</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" @click.prevent="exec('outdent')" :disabled="viewMode !== 'wysiwyg'" title="Outdent">← Outdent</button>

      <!-- Sub/Superscript -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" :class="isActive('subscript') ? 'bg-gray-100 dark:bg-gray-700' : ''" @click.prevent="exec('subscript')" :disabled="viewMode !== 'wysiwyg'" title="Subscript">x₂</button>
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" :class="isActive('superscript') ? 'bg-gray-100 dark:bg-gray-700' : ''" @click.prevent="exec('superscript')" :disabled="viewMode !== 'wysiwyg'" title="Superscript">x²</button>

      <!-- Font Size -->
      <select class="px-2 py-1 text-xs border rounded disabled:opacity-50" :disabled="viewMode !== 'wysiwyg'" @change="applyFontSize($event)">
        <option value="3">Normal</option>
        <option value="2">Small</option>
        <option value="4">Large</option>
        <option value="5">X-Large</option>
      </select>

      <!-- Colors -->
      <label class="text-xs text-gray-600 dark:text-gray-300">A
        <input type="color" class="align-middle w-6 h-6 p-0 border rounded ml-1" :disabled="viewMode !== 'wysiwyg'" @input="setColor($event)" title="Text Color" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">Bg
        <input type="color" class="align-middle w-6 h-6 p-0 border rounded ml-1" :disabled="viewMode !== 'wysiwyg'" @input="setBgColor($event)" title="Background Color" />
      </label>

      <!-- Table Insert -->
      <button type="button" class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50" @click.prevent="insertTablePrompt" :disabled="viewMode !== 'wysiwyg'" title="Insert Table">Table</button>

      <!-- Mode toggles (Preview removed) -->
      <span class="ml-auto"></span>
      <button
        type="button"
        class="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-white/10"
        :class="viewMode === 'source' ? 'bg-gray-100 dark:bg-gray-700' : ''"
        @click.prevent="toggleMode(viewMode === 'source' ? 'wysiwyg' : 'source')"
        title="Edit HTML Source"
      >HTML</button>
    </div>

    <!-- WYSIWYG editable area -->
    <div
      v-show="viewMode === 'wysiwyg'"
      ref="editorRef"
      class="min-h-[120px] w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-dark-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none"
      contenteditable="true"
      :placeholder="placeholder"
      @input="onInput"
    ></div>

    <!-- Preview removed -->

    <!-- HTML Source Editor -->
    <textarea
      v-if="viewMode === 'source'"
      v-model="sourceContent"
      class="min-h-[120px] w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-dark-800 dark:text-gray-200 rounded-md shadow-sm font-mono text-xs"
      :placeholder="placeholder || 'Edit HTML source'"
    ></textarea>
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
const viewMode = ref<'wysiwyg' | 'source'>('wysiwyg')
const sourceContent = ref('')

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = props.modelValue || ''
  }
  try {
    document.execCommand('styleWithCSS', false, 'true')
  } catch (e) {
    // no-op: some browsers may not support this
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

// Preview is read-only; clicking switches to HTML source mode

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

const unlink = () => {
  document.execCommand('unlink', false)
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

const applyFontSize = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value
  document.execCommand('fontSize', false, value)
}

const setColor = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  document.execCommand('foreColor', false, value)
}

const setBgColor = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  document.execCommand('hiliteColor', false, value)
}

const insertTablePrompt = () => {
  const rowsStr = prompt('Rows', '2')
  const colsStr = prompt('Columns', '2')
  const rows = Math.max(1, parseInt(rowsStr || '2', 10))
  const cols = Math.max(1, parseInt(colsStr || '2', 10))
  let html = '<table style="border-collapse:collapse;width:100%;" border="0" cellpadding="0" cellspacing="0">'
  for (let r = 0; r < rows; r++) {
    html += '<tr>'
    for (let c = 0; c < cols; c++) {
      html += '<td style="border:1px solid #e5e7eb;padding:6px;">&nbsp;</td>'
    }
    html += '</tr>'
  }
  html += '</table>'
  document.execCommand('insertHTML', false, html)
}

const toggleMode = (mode: 'wysiwyg' | 'source') => {
  if (mode === 'source') {
    // Seed the textarea from current HTML
    sourceContent.value = editorRef.value?.innerHTML || props.modelValue || ''
  }
  viewMode.value = mode
}

// When editing HTML source, keep modelValue in sync
watch(sourceContent, (val) => {
  if (viewMode.value === 'source') {
    emit('update:modelValue', val || '')
  }
})

// Highlight active formatting in toolbar (best-effort; only in WYSIWYG)
const isActive = (command: string): boolean => {
  return viewMode.value === 'wysiwyg' ? (!!document.queryCommandState(command)) : false
}
</script>

<style scoped>
[contenteditable][placeholder]:empty:before {
  content: attr(placeholder);
  color: #9ca3af; /* gray-400 */
}
</style>