import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig(({ command, mode }) => {
  // 根據不同環境設定 base 路徑
  let base = '/'
  if (command === 'build') {
    // 如果是 GitHub Pages 部署
    if (mode === 'github') {
      base = '/lmsVant/'
    }
    // 如果是 IIS 部署，使用根路徑
    else if (mode === 'production') {
      base = '/'
    }
  }
  
  return {
    base: base,
    plugins: [
      vue(),
      Components({
        resolvers: [VantResolver()],
      }),
    ],
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
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            vant: ['vant']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'vant']
    },
    server: {
      port: 3000,
      host: 'localhost',
      open: true
    }
  }
})