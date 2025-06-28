import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  base: '/lmsVant/', // Set base path for deployment
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  define: {
    global: 'globalThis',
    __VUE_PROD_DEVTOOLS__: false
  },
  build: {
    target: 'esnext',
    minify: 'esbuild'
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vant']
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
})