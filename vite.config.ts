// import { fileURLToPath, URL } from 'node:url'

// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     vueJsx(),
//     vueDevTools(),
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     },
//   },
// })
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Enable tree shaking for Vue components
          hoistStatic: true,
          cacheHandlers: true
        }
      }
    }),
    vueJsx(),
    vueDevTools(),
    visualizer({
      filename: 'stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Electron support
  base: process.env.ELECTRON === 'true' ? './' : '/',
  server: {
    port: 5173,
    strictPort: true
  },
/*  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '5173'),
  },
*/
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '4173'),
    allowedHosts: ['enjoyadmin.onrender.com']
  },
  build: {
    chunkSizeWarningLimit: 500,
    minify: 'esbuild',
    target: 'esnext',
    cssMinify: true,
    reportCompressedSize: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vue core runtime
          if (id.includes('vue/dist') || id.includes('@vue/runtime')) {
            return 'vue-runtime'
          }
          // Vue compiler
          if (id.includes('@vue/compiler')) {
            return 'vue-compiler'
          }
          // Vue reactivity system
          if (id.includes('@vue/reactivity')) {
            return 'vue-reactivity-core'
          }
          // Vue Router
          if (id.includes('vue-router')) {
            return 'vue-router'
          }
          // Pinia - integrate with main bundle to avoid separate chunk
          // Removed separate pinia chunk to prevent loading issues
          // Vue DevTools
          if (id.includes('vue-devtools') || id.includes('@vue/devtools')) {
            return 'vue-devtools'
          }
          // Vue JSX support
          if (id.includes('@vue/babel') || id.includes('vue-jsx')) {
            return 'vue-jsx'
          }
          // Vue shared utilities
          if (id.includes('@vue/shared')) {
            return 'vue-shared'
          }
          // Vue devtools
          if (id.includes('vue-devtools') || id.includes('@vue/devtools')) {
            return 'vue-devtools'
          }
          // Vue server renderer
          if (id.includes('@vue/server-renderer')) {
            return 'vue-ssr'
          }
          // Vue core - split more granularly
          if (id.includes('vue/dist/vue.esm-bundler.js') || id.includes('vue/dist/vue.runtime.esm-bundler.js')) {
            return 'vue-core'
          }
          // Vue reactivity system
          if (id.includes('@vue/reactivity-transform') || id.includes('vue/reactivity')) {
            return 'vue-reactivity'
          }
          // VueUse core composables
          if (id.includes('@vueuse/core')) {
            return 'vueuse-core'
          }
          // Other VueUse packages
          if (id.includes('@vueuse') || id.includes('vue-use')) {
            return 'vueuse-extras'
          }
          // Vue i18n
          if (id.includes('vue-i18n')) {
            return 'vue-i18n'
          }
          // Vue toast notifications
          if (id.includes('vue-toastification')) {
            return 'vue-toast'
          }
          // Vue print utilities
          if (id.includes('vue-to-print')) {
            return 'vue-print'
          }
          // Vue flatpickr component
          if (id.includes('vue-flatpickr')) {
            return 'vue-datepicker'
          }
          // Pinia plugins
          if (id.includes('pinia-plugin')) {
            return 'pinia-plugins'
          }
          // Vue3 PDF App
          if (id.includes('vue3-pdf-app')) {
            return 'vue3-pdf-app'
          }
          // PDF.js core library
          if (id.includes('pdfjs-dist') || id.includes('pdf.js')) {
            return 'pdfjs-core'
          }
          // HTML to PDF converter
          if (id.includes('html2pdf') || id.includes('html2canvas') || id.includes('jspdf')) {
            return 'html2pdf-tools'
          }
          // Other PDF utilities
          if (id.includes('pdf') && !id.includes('vue-pdf')) {
            return 'pdf-utilities'
          }
          // Vue drag and drop
          if (id.includes('vuedraggable')) {
            return 'vue-draggable'
          }
          // Vue vector map
          if (id.includes('vuevectormap') || id.includes('jsvectormap')) {
            return 'vue-maps'
          }
          // Main Vue package (core functions like ref, computed, etc.)
          if (id.includes('node_modules\\vue\\') || id.includes('node_modules/vue/')) {
            if (!id.includes('vue-router') && !id.includes('pinia') && !id.includes('vue-i18n') && !id.includes('vue-pdf') && !id.includes('vuedraggable')) {
              return 'vue-core-functions'
            }
          }
          // Vue 3 composition utilities
          if (id.includes('@vue/composition-api') || id.includes('vue-demi')) {
            return 'vue-composition'
          }
          // Vue template compiler
          if (id.includes('@vue/compiler-sfc') || id.includes('@vue/compiler-dom')) {
            return 'vue-template-compiler'
          }
          // Lucide Vue Next icons
          if (id.includes('lucide-vue-next')) {
            return 'lucide-icons'
          }
          // Vue Toastification
          if (id.includes('vue-toastification')) {
            return 'vue-toast'
          }
          // Vue Flatpickr datepicker
          if (id.includes('vue-flatpickr-component') || id.includes('flatpickr')) {
            return 'vue-datepicker'
          }
          // VueDraggable
          if (id.includes('vuedraggable') || id.includes('sortablejs')) {
            return 'vue-draggable'
          }
          // VueVectorMap
          if (id.includes('vuevectormap') || id.includes('jsvectormap')) {
            return 'vue-maps'
          }
          // Swiper carousel
          if (id.includes('swiper')) {
            return 'swiper'
          }
          // Tippy.js tooltips
          if (id.includes('tippy.js')) {
            return 'tooltip'
          }
          // VueUse core composables
          if (id.includes('@vueuse/core')) {
            return 'vueuse-core'
          }
          // Other VueUse packages
          if (id.includes('@vueuse')) {
            return 'vueuse-extras'
          }
          // Date-fns date library
          if (id.includes('date-fns')) {
            return 'date-fns'
          }
          // Luxon date library
          if (id.includes('luxon')) {
            return 'date-utils'
          }
          // PapaParse CSV parser
          if (id.includes('papaparse')) {
            return 'csv-parser'
          }
          // UUID generator
          if (id.includes('uuid')) {
            return 'uuid'
          }
          // Vue to Print
          if (id.includes('vue-to-print')) {
            return 'vue-print'
          }
          // Vue Router
          if (id.includes('vue-router')) {
            return 'vue-router'
          }
          // Vue i18n internationalization
          if (id.includes('vue-i18n')) {
            return 'vue-i18n'
          }
          // Vue Toastification notifications
          if (id.includes('vue-toastification')) {
            return 'vue-toast'
          }
          // Vue Flatpickr datepicker
          if (id.includes('vue-flatpickr-component') || id.includes('flatpickr')) {
            return 'vue-datepicker'
          }
          // Vue core functions and composition API
          if (id.includes('vue/dist') || id.includes('@vue/runtime') || id.includes('@vue/reactivity')) {
            return 'vue-core'
          }
          // Vue compiler and template processing
          if (id.includes('@vue/compiler') || id.includes('@vue/shared')) {
            return 'vue-compiler'
          }
          // Remaining Vue ecosystem
          if (id.includes('vue') && !id.includes('vue-router') && !id.includes('pinia')) {
            return 'vue-misc'
          }
          // ECharts core
          if (id.includes('echarts/core')) {
            return 'echarts-core'
          }
          // ECharts charts (bar, line, pie, etc.)
          if (id.includes('echarts/charts')) {
            return 'echarts-charts'
          }
          // ECharts components (tooltip, legend, etc.)
          if (id.includes('echarts/components')) {
            return 'echarts-components'
          }
          // ECharts renderers
          if (id.includes('echarts/renderers')) {
            return 'echarts-renderers'
          }
          // Remaining ECharts modules
          if (id.includes('echarts')) {
            return 'echarts-misc'
          }
          // Icon libraries - separate by size
          if (id.includes('lucide-vue-next')) {
            return 'icons-lucide'
          }
          if (id.includes('bootstrap-icons')) {
            return 'icons-bootstrap'
          }
          // Large UI libraries
          if (id.includes('fullcalendar')) {
            return 'calendar'
          }
          if (id.includes('swiper')) {
            return 'swiper'
          }
          if (id.includes('flatpickr')) {
            return 'datepicker'
          }
          // HTTP and utilities
          if (id.includes('axios')) {
            return 'http'
          }
          if (id.includes('lodash')) {
            return 'lodash'
          }
          if (id.includes('dayjs') || id.includes('luxon')) {
            return 'date-utils'
          }
          // PDF and document libraries
          if (id.includes('html2pdf') || id.includes('pdfjs') || id.includes('vue3-pdf')) {
            return 'documents'
          }
          // Cloudinary
          if (id.includes('@cloudinary')) {
            return 'cloudinary'
          }
         
          // Large vendor libraries - separate heavy ones
          if (id.includes('node_modules') && id.includes('typescript')) {
            return 'typescript'
          }
          if (id.includes('node_modules') && id.includes('vite')) {
            return 'vite-runtime'
          }
          if (id.includes('node_modules') && id.includes('rollup')) {
            return 'rollup'
          }
          if (id.includes('node_modules') && id.includes('esbuild')) {
            return 'esbuild'
          }
          // Separate large utility libraries
          if (id.includes('node_modules') && (id.includes('date-fns') || id.includes('luxon'))) {
            return 'date-libs'
          }
          if (id.includes('node_modules') && id.includes('papaparse')) {
            return 'csv-parser'
          }
          if (id.includes('node_modules') && id.includes('uuid')) {
            return 'uuid'
          }
          if (id.includes('node_modules') && id.includes('tippy.js')) {
            return 'tooltip'
          }
          // Polyfills and compatibility
          if (id.includes('node_modules') && (id.includes('core-js') || id.includes('regenerator'))) {
            return 'polyfills'
          }
          // Axios HTTP client
          if (id.includes('axios')) {
            return 'axios'
          }
          // Lodash utility library
          if (id.includes('lodash')) {
            return 'lodash'
          }
          // Luxon date library
          if (id.includes('luxon')) {
            return 'luxon'
          }
          // PapaParse CSV parser
          if (id.includes('papaparse')) {
            return 'papaparse'
          }
          // Swiper carousel library
          if (id.includes('swiper')) {
            return 'swiper'
          }
          // Tippy.js tooltip library
          if (id.includes('tippy.js')) {
            return 'tippy'
          }
          // VueDraggable library
          if (id.includes('vuedraggable') || id.includes('sortablejs')) {
            return 'vue-draggable'
          }
          // VueVectorMap library
          if (id.includes('vuevectormap') || id.includes('jsvectormap')) {
            return 'vue-vectormap'
          }
          // Cloudinary SDK
          if (id.includes('@cloudinary')) {
            return 'cloudinary'
          }
          // Core-js polyfills
          if (id.includes('core-js') || id.includes('regenerator')) {
            return 'polyfills'
          }
          // TypeScript runtime
          if (id.includes('typescript')) {
            return 'typescript'
          }
          // Remaining smaller vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.vue', '') : 'chunk'
          return `js/[name]-[hash].js`
        },
        assetFileNames: (assetInfo:any) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        }
      },
      external: (id) => {
        return false;
      }
    },
    // Electron build optimizations
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    // Enable source maps for debugging but exclude from production
    sourcemap: false,
  }
})
