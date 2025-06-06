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
// import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    // visualizer({ open: true })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
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
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          aggrid: ['ag-grid-vue3', 'ag-grid-community'],
          libs: ['axios', 'luxon'],
        },
      },
    },
  }
})
