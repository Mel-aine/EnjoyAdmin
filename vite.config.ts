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

export default defineConfig(({ mode }) => ({
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
    // Load Vue DevTools only in development to avoid production bundle side-effects
    ...(process.env.NODE_ENV === 'development' ? [vueDevTools()] : []),
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
  // Supprimer console/debugger uniquement en production
  esbuild: mode === 'production' ? {
    drop: ['console', 'debugger']
  } : undefined,
  // Electron support
  base: process.env.ELECTRON === 'true' ? './' : '/',
  server: {
    port: 5173,
    strictPort: true,
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
        // Simplify chunking to Vite defaults to avoid aggressive grouping issues
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
    // Enable source maps temporarily to debug the vendor _s error in preview
    sourcemap: true,
  }
}))
